<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { imageUtils } from '#app/ui/utils/image';
  import { createEventDispatcher } from 'svelte';
  import type { App } from '#app/ui/base/app';
  import { keyboardUtils } from '#app/ui/utils/keyboard';
  import type { FileFacade } from '#app/domain/file/facade';

  let { imageIds, canEdit = false } = $props();
  const dispatch = createEventDispatcher();

  const app = getContext<App>('app');
  const fileFacade = getContext<FileFacade>('fileFacade');

  let imageUrls = $state<string[]>([]);
  let isUploading = $state(false);
  let uploadProgress = $state(0);
  let selectedIndex = $state<number | null>(null);
  let currentSlide = $state(0);
  let dragIndex = $state<number | null>(null);
  let dropTargetIndex = $state<number | null>(null);

  // Общие состояния для DnD
  let dragElementRect = $state<DOMRect | null>(null);
  let thumbnailsContainer = $state<HTMLDivElement | null>(null);
  let thumbElements: HTMLImageElement[] = [];
  let dropIndicatorPos = $state<{index: number, x: number} | null>(null);

  // Mobile-specific states
  let touchStartIndex = -1;
  let touchStartPos = $state({ x: 0, y: 0 });
  let isTouchDragging = $state(false);
  let touchStartTime = 0;

  async function loadImages() {
    const urls = [];
    for (const id of imageIds) {
      const res = await fileFacade.getFile(id);
      if (res.isSuccess()) urls.push(res.value.url);
    }
    imageUrls = urls;
  }

  $effect(() => {
    loadImages();
  });

  function reorderImages(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    
    const newIds = [...imageIds];
    const [movedId] = newIds.splice(fromIndex, 1);
    newIds.splice(toIndex, 0, movedId);
    imageIds = newIds;
    loadImages();
    
    // Отправляем событие с новым порядком изображений
    dispatch('reorderImages', newIds);
  }

  // Desktop DnD handlers
  function handleDragStart(e: DragEvent, index: number) {
    if (!canEdit) return;
    
    dragIndex = index;
    e.dataTransfer?.setData('text/plain', index.toString());
    e.dataTransfer!.effectAllowed = 'move';
    
    const target = e.target as HTMLElement;
    dragElementRect = target.getBoundingClientRect();
    target.classList.add('dragging');
  }

  function handleDragOver(e: DragEvent, index: number) {
    if (!canEdit) return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    
    dropTargetIndex = index;
    updateDropPosition(e.clientX);
  }

  function handleDragEnd(e: DragEvent) {
    (e.target as HTMLElement).classList.remove('dragging');
    dragIndex = null;
    dropTargetIndex = null;
    dropIndicatorPos = null;
  }

  function handleDrop(e: DragEvent, targetIndex: number) {
    if (!canEdit) return;
    e.preventDefault();
    
    const sourceIndex = Number(e.dataTransfer?.getData('text/plain'));
    reorderImages(sourceIndex, targetIndex);
    
    dropTargetIndex = null;
    dropIndicatorPos = null;
  }

  // Mobile DnD handlers
  function handleTouchStart(e: TouchEvent, index: number) {
    if (!canEdit) return;
    
    const touch = e.touches[0];
    touchStartPos = { x: touch.clientX, y: touch.clientY };
    touchStartIndex = index;
    touchStartTime = Date.now();
    
    const target = e.currentTarget as HTMLElement;
    dragElementRect = target.getBoundingClientRect();
    target.classList.add('dragging');
  }

  function handleTouchMove(e: TouchEvent) {
    if (!canEdit || touchStartIndex === -1) return;
    
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartPos.x;
    const diffY = touch.clientY - touchStartPos.y;
    
    if (!isTouchDragging && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      isTouchDragging = true;
      dragIndex = touchStartIndex;
    }
    
    if (isTouchDragging) {
      updateDropPosition(touch.clientX);
    }
  }

  function handleTouchEnd(e: TouchEvent, index: number) {
    if (!canEdit) return;
    
    if (isTouchDragging) {
      if (dropTargetIndex !== null && dragIndex !== null && dropTargetIndex !== dragIndex) {
        reorderImages(dragIndex, dropTargetIndex);
      }
      isTouchDragging = false;
    } else if (Date.now() - touchStartTime < 200) {
      toggleSelection(index);
    }
    
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('dragging');
    
    touchStartIndex = -1;
    dragIndex = null;
    dropTargetIndex = null;
    dropIndicatorPos = null;
  }

  function updateDropPosition(x: number) {
    if (!thumbnailsContainer || !dragElementRect) return;
    
    const thumbs = Array.from(thumbnailsContainer.querySelectorAll('.thumb')) as HTMLElement[];
    const containerRect = thumbnailsContainer.getBoundingClientRect();
    const relativeX = x - containerRect.left;
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    thumbs.forEach((thumb, index) => {
      const thumbRect = thumb.getBoundingClientRect();
      const thumbCenter = thumbRect.left + thumbRect.width/2 - containerRect.left;
      const distance = Math.abs(relativeX - thumbCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    if (thumbs[closestIndex]) {
      const thumbRect = thumbs[closestIndex].getBoundingClientRect();
      const posX = thumbRect.left + thumbRect.width/2 - containerRect.left;
      dropIndicatorPos = { index: closestIndex, x: posX };
      dropTargetIndex = closestIndex;
    }
  }

  function toggleSelection(index: number) {
    selectedIndex = selectedIndex === index ? null : index;
  }

  async function confirmDelete() {
    if (selectedIndex === null) return;
    
    const ok = await app.showDialog({
      title: 'Удаление фотографии',
      content: 'Вы уверены, что хотите удалить выбранную фотографию?',
      confirmVariant: 'danger',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
    });
    
    if (ok) {
      const idToDelete = imageIds[selectedIndex];
      dispatch('deleteImage', idToDelete);
      selectedIndex = null;
    }
  }

  onMount(() => {
    const updateThumbElements = () => {
      if (thumbnailsContainer) {
        thumbElements = Array.from(thumbnailsContainer.querySelectorAll('.thumb')) as HTMLImageElement[];
        
        thumbElements.forEach((thumb, index) => {
          thumb.addEventListener('touchstart', (e) => handleTouchStart(e, index), { passive: false });
          thumb.addEventListener('touchmove', (e) => handleTouchMove(e), { passive: false });
          thumb.addEventListener('touchend', (e) => handleTouchEnd(e, index), { passive: false });
        });
      }
    };

    updateThumbElements();
    
    // Обновляем при изменении количества изображений
    $effect(() => {
      if (imageUrls.length) {
        updateThumbElements();
      }
    });

    return () => {
      // Очистка обработчиков
      thumbElements.forEach(thumb => {
        thumb.removeEventListener('touchstart', handleTouchStart as any);
        thumb.removeEventListener('touchmove', handleTouchMove as any);
        thumb.removeEventListener('touchend', handleTouchEnd as any);
      });
    }
  });

  function openFileDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      isUploading = true;
      const addedIds: string[] = [];
      for (const file of files) {
        uploadProgress = 0;
        const compressed = await imageUtils.compressImage(file, 0.7, 1920);
        const res = await fileFacade.uploadFile({
          file: compressed,
          access: { type: 'public' },
          subDir: 'model-images',
          onProgress: p => uploadProgress = p,
        });
        if (res.isSuccess()) addedIds.push(res.value.id);
        else app.error('Ошибка при загрузке файла', { file });
      }
      uploadProgress = 100;
      isUploading = false;
      dispatch('addImages', addedIds);
    };
    input.click();
  }

  function handleKeyAction(e: KeyboardEvent, action: () => void) {
    if (keyboardUtils.isActionKey(e)) {
      e.preventDefault();
      action();
    }
  }

  function slideChanged(e: CustomEvent) {
    currentSlide = e.detail.index;
  }
</script>

<style>
  .wrapper {
    display: block;
    width: 100%;
    max-height: 60vh;
    overflow: hidden;
    margin-bottom: 2rem;
    position: relative;
  }

  sl-carousel {
    height: 100%;
  }

  sl-carousel-item {
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .thumbnails {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
    padding: 0.5rem;
    touch-action: none;
  }

  .thumb-button {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    user-select: none;
    will-change: transform, opacity;
  }

  .thumb-button.selected {
    border-color: var(--sl-color-primary-500);
    box-shadow: 0 0 0 2px var(--sl-color-primary-300);
  }

  .thumb-button.dragging {
    opacity: 0.5;
    transform: scale(0.95);
    z-index: 10;
  }

  .thumb-button.drop-target {
    transform: scale(1.05);
    border: 2px dashed var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-100);
  }

  @media (hover: none) {
    .thumb-button {
      cursor: grab;
    }
    .thumb-button:active {
      cursor: grabbing;
    }
  }

  .drop-indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--sl-color-primary-500);
    z-index: 5;
    pointer-events: none;
    transform: translateX(-50%);
    transition: left 0.2s ease;
  }

  .button-bar {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    display: flex;
    gap: 1.5rem;
    z-index: 10;
  }

  sl-icon-button::part(base) {
    transform: scale(1.8);
  }

  .add-btn::part(base) {
    color: var(--sl-color-success-600);
  }

  .delete-btn::part(base) {
    color: var(--sl-color-danger-600);
  }

  .no-images {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--sl-color-gray-500);
    font-style: italic;
  }
</style>

<div class="wrapper">
  {#if imageUrls.length === 0}
    <div class="no-images">Фотографии не загружены</div>
  {:else}
    <sl-carousel onsl-change={slideChanged} loop navigation>
      {#each imageUrls as url (url)}
        <sl-carousel-item>
          <img src={url} alt="" role="presentation" />
        </sl-carousel-item>
      {/each}
    </sl-carousel>
    
    <div class="thumbnails" bind:this={thumbnailsContainer}>
      {#if dropIndicatorPos}
        <div class="drop-indicator" style="left: {dropIndicatorPos.x}px"></div>
      {/if}
      
      {#each imageUrls as url, i (url)}
        <button
          type="button"
          class="thumb-button"
          class:selected={selectedIndex === i}
          class:dragging={dragIndex === i}
          class:drop-target={dropTargetIndex === i && dragIndex !== i}
          onclick={() => canEdit && toggleSelection(i)}
          ondragstart={(e) => canEdit && handleDragStart(e, i)}
          ondragend={handleDragEnd}
          ondragover={(e) => canEdit && handleDragOver(e, i)}
          ondragleave={() => dropTargetIndex = null}
          ondrop={(e) => canEdit && handleDrop(e, i)}
          ontouchstart={(e) => canEdit && handleTouchStart(e, i)}
          ontouchmove={(e) => canEdit && handleTouchMove(e)}
          ontouchend={(e) => canEdit && handleTouchEnd(e, i)}
        >
          <img
            src={url}
            class="thumb-image"
            alt={`Миниатюра ${i + 1}`}
            draggable={canEdit}
          />
        </button>
      {/each}
    </div>
  {/if}

  {#if canEdit}
    <div class="button-bar">
      <sl-icon-button
        class="add-btn"
        name="plus-square"
        label="Добавить"
        role="button"
        tabindex="0"
        onclick={openFileDialog}
        onkeydown={(e: KeyboardEvent) => handleKeyAction(e, openFileDialog)}
      ></sl-icon-button>
      {#if selectedIndex !== null}
        <sl-icon-button
          class="delete-btn"
          name="x-square"
          label="Удалить"
          role="button"
          tabindex="0"
          onclick={confirmDelete}
          onkeydown={(e: KeyboardEvent) => handleKeyAction(e, confirmDelete)}
        ></sl-icon-button>
      {/if}
    </div>
  {/if}
</div>

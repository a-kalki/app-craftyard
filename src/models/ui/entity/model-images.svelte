<script lang="ts">
  import { onMount } from 'svelte';
  import { fileApi } from 'src/files/ui/files-api-local';
  import { imageUtils } from '#app/ui/utils/image';

  export let imageIds: string[] = [];
  export let canEdit: boolean = false;

  let imageUrls: string[] = [];
  let isUploading = false;
  let uploadProgress = 0;

  let draggedIndex: number | null = null;
  let activeSlide = 0;

  onMount(() => {
    loadImages();
  });

  $: if (imageIds) {
    loadImages();
  }

  async function loadImages() {
    const urls: string[] = [];
    for (const id of imageIds) {
      const result = await fileApi.getFile(id);
      if (result.isSuccess()) urls.push(result.value.url);
    }
    imageUrls = urls;
  }

  async function openFileDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async () => {
      const files = input.files ? Array.from(input.files) : [];
      if (!files.length) return;

      isUploading = true;
      uploadProgress = 0;
      let addedIds: string[] = [];

      for (const file of files) {
        const compressed = await imageUtils.compressImage(file, 0.7, 1920);
        const result = await fileApi.uploadFile({
          file: compressed,
          access: { type: 'public' },
          subDir: 'model-images',
          onProgress: (p: number) => uploadProgress = p
        });
        if (result.isSuccess()) addedIds.push(result.value.id);
      }

      uploadProgress = 100;
      isUploading = false;

      const event = new CustomEvent('add-images', {
        detail: { imageIds: addedIds },
        bubbles: true,
        composed: true
      });
      dispatchEvent(event);
    };
    input.click();
  }

  function handleDragStart(i: number) {
    draggedIndex = i;
  }

  function handleDrop(i: number) {
    if (draggedIndex === null || draggedIndex === i) return;
    const newIds = [...imageIds];
    const [moved] = newIds.splice(draggedIndex, 1);
    newIds.splice(i, 0, moved);

    const reorderEvent = new CustomEvent('reorder-images', {
      detail: { imageIds: newIds },
      bubbles: true,
      composed: true
    });
    dispatchEvent(reorderEvent);
    draggedIndex = null;
  }
</script>

<div class="wrapper">
  {#if imageUrls.length === 0}
    <div class="no-images">Фотографии не загружены</div>
  {:else}
    <div class="carousel">
      <img src={imageUrls[activeSlide]} alt="preview" />
    </div>

    <div class="thumbnails">
      {#each imageUrls as url, i}
        <img
          src={url}
          class="thumb"
          draggable="true"
          on:dragstart={() => handleDragStart(i)}
          on:drop={() => handleDrop(i)}
          on:dragover|preventDefault
          on:click={() => activeSlide = i}
        />
      {/each}
    </div>
  {/if}

  {#if canEdit}
    <div class="button-bar">
      <button class="add-btn" on:click={openFileDialog}>Добавить</button>
    </div>
  {/if}

  {#if isUploading}
    <progress max="100" value={uploadProgress}></progress>
  {/if}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .carousel {
    width: 100%;
    max-height: 60vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .carousel img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .thumbnails {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
    justify-content: center;
  }
  .thumb {
    width: 48px;
    height: 48px;
    object-fit: cover;
    cursor: grab;
    border-radius: 4px;
    border: 2px solid transparent;
  }
  .thumb:hover {
    border-color: #0d6efd;
  }
  .button-bar {
    margin-top: 1rem;
  }
</style>

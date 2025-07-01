import { LitElement, html, css, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { imageUtils } from '#app/ui/utils/image';
import { keyboardUtils } from '#app/ui/utils/keyboard';
import type { App } from '#app/ui/base/app';
import { ref } from 'lit/directives/ref.js';
import type { UiFileFacade } from '#files/ui/facade';
import type { CyOwnerAggregateAttrs } from '#app/domain/types';

@customElement('model-images')
export class ModelImages extends LitElement {
  @property({ type: Object }) ownerAttrs?: CyOwnerAggregateAttrs;
  @property({ type: Array }) imageIds: string[] = [];
  @property({ type: Boolean }) canEdit = false;

  @state() private imageUrls: string[] = [];
  @state() private isUploading = false;
  @state() private uploadProgress = 0;
  @state() private currentSlide = 0;
  @state() private selectedIndex: number | null = null;
  @state() private dragIndex: number | null = null;
  @state() private dropTargetIndex: number | null = null;
  @state() private dropIndicatorPos: {index: number, x: number} | null = null;
  @state() private isTouchDragging = false;

  private app: App = (window as any).app;
  private fileFacade: UiFileFacade = (window as any).fileFacade;
  private thumbnailsContainer: HTMLDivElement | null = null;
  private thumbElements: HTMLElement[] = [];
  private dragElementRect: DOMRect | null = null;
  private touchStartIndex = -1;
  private touchStartPos = { x: 0, y: 0 };
  private touchStartTime = 0;

  static styles = css`
    :host {
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
      padding: 0;
      background: none;
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
      color: var(--sl-color-primary-600);
    }

    .delete-btn::part(base) {
      color: var(--sl-color-danger-600);
    }

    .empty-carousel-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--sl-color-gray-500);
      font-style: italic;
      background-color: var(--sl-color-gray-100);
      border-radius: var(--sl-border-radius-medium);
    }
  `;

  protected async updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('imageIds') && this.imageIds) {
      await this.updateImageUrlsFromIds();
    }

    if (changedProperties.has('imageUrls')) {
      this.setupThumbElements();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupEventListeners();
  }

  private async updateImageUrlsFromIds() {
    const newUrls: string[] = [];
    for (const id of this.imageIds) {
      const res = await this.fileFacade.getFile(id);
      if (res.isSuccess()) {
        newUrls.push(res.value.url);
      } else {
        this.app.error(`Failed to load image with ID: ${id}`, { result: res })
        return;
      }
    }
    this.imageUrls = newUrls;
  }

  private reorderImages(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    const newIds = [...this.imageIds];
    const [movedId] = newIds.splice(fromIndex, 1);
    newIds.splice(toIndex, 0, movedId);

    this.imageIds = newIds;

    this.dispatchEvent(new CustomEvent('reorderImages', {
      detail: newIds,
      bubbles: true,
      composed: true
    }));
  }

  // Desktop DnD handlers
  private handleDragStart(e: DragEvent, index: number) {
    if (!this.canEdit) return;
    
    this.dragIndex = index;
    e.dataTransfer?.setData('text/plain', index.toString());
    e.dataTransfer!.effectAllowed = 'move';
    
    const target = e.target as HTMLElement;
    this.dragElementRect = target.getBoundingClientRect();
    target.classList.add('dragging');
  }

  private handleDragOver(e: DragEvent, index: number) {
    if (!this.canEdit) return;
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
    
    this.dropTargetIndex = index;
    this.updateDropPosition(e.clientX);
  }

  private handleDragEnd(e: DragEvent) {
    (e.target as HTMLElement).classList.remove('dragging');
    this.dragIndex = null;
    this.dropTargetIndex = null;
    this.dropIndicatorPos = null;
  }

  private handleDrop(e: DragEvent, targetIndex: number) {
    if (!this.canEdit) return;
    e.preventDefault();
    
    const sourceIndex = Number(e.dataTransfer?.getData('text/plain'));
    this.reorderImages(sourceIndex, targetIndex);
    
    this.dropTargetIndex = null;
    this.dropIndicatorPos = null;
  }

  // Mobile DnD handlers
  private handleTouchStart(e: TouchEvent, index: number) {
    if (!this.canEdit) return;
    
    const touch = e.touches[0];
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
    this.touchStartIndex = index;
    this.touchStartTime = Date.now();
    
    const target = e.currentTarget as HTMLElement;
    this.dragElementRect = target.getBoundingClientRect();
    target.classList.add('dragging');
  }

  private handleTouchMove(e: TouchEvent) {
    if (!this.canEdit || this.touchStartIndex === -1) return;
    
    const touch = e.touches[0];
    const diffX = touch.clientX - this.touchStartPos.x;
    const diffY = touch.clientY - this.touchStartPos.y;
    
    if (!this.isTouchDragging && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      this.isTouchDragging = true;
      this.dragIndex = this.touchStartIndex;
    }
    
    if (this.isTouchDragging) {
      this.updateDropPosition(touch.clientX);
    }
  }

  private handleTouchEnd(e: TouchEvent, index: number) {
    if (!this.canEdit) return;
    
    if (this.isTouchDragging) {
      if (this.dropTargetIndex !== null && this.dragIndex !== null && 
          this.dropTargetIndex !== this.dragIndex) {
        this.reorderImages(this.dragIndex, this.dropTargetIndex);
      }
      this.isTouchDragging = false;
    } else if (Date.now() - this.touchStartTime < 200) {
      this.toggleSelection(index);
    }
    
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('dragging');
    
    this.touchStartIndex = -1;
    this.dragIndex = null;
    this.dropTargetIndex = null;
    this.dropIndicatorPos = null;
  }

  private updateDropPosition(x: number) {
    if (!this.thumbnailsContainer || !this.dragElementRect) return;
    
    const thumbs = Array.from(this.thumbnailsContainer.querySelectorAll('.thumb')) as HTMLElement[];
    const containerRect = this.thumbnailsContainer.getBoundingClientRect();
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
      this.dropIndicatorPos = { index: closestIndex, x: posX };
      this.dropTargetIndex = closestIndex;
    }
  }

  private toggleSelection(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  private async confirmDelete() {
    if (this.selectedIndex === null) return;
    
    const ok = await this.app.showDialog({
      title: 'Удаление фотографии',
      content: 'Вы уверены, что хотите удалить выбранную фотографию?',
      confirmVariant: 'danger',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
    });
    
    if (ok) {
      const idToDelete = this.imageIds[this.selectedIndex];
      this.dispatchEvent(new CustomEvent('deleteImage', {
        detail: idToDelete,
        bubbles: true,
        composed: true
      }));
      this.selectedIndex = null;
    }
  }

  private openFileDialog() {
    if (!this.ownerAttrs) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      this.isUploading = true;
      const addedIds: string[] = [];
      for (const file of files) {
        this.uploadProgress = 0;
        const compressed = await imageUtils.compressImage(file, 0.7, 1920);
        const uploadResult = await this.fileFacade.uploadFile({
          ...this.ownerAttrs!,
          file: compressed,
          onProgress: (p: number) => this.uploadProgress = p,
        });
        if (uploadResult.isSuccess()) addedIds.push(uploadResult.value.id);
        else this.app.error('Ошибка при загрузке файла', { ownerAttrs: this.ownerAttrs, file });
      }

      this.uploadProgress = 100;
      this.isUploading = false;
      this.dispatchEvent(new CustomEvent('addImages', {
        detail: addedIds,
        bubbles: true,
        composed: true
      }));
    };
    input.click();
  }

  private handleKeyAction(e: KeyboardEvent, action: () => void) {
    if (keyboardUtils.isActionKey(e)) {
      e.preventDefault();
      action();
    }
  }

  private slideChanged(e: CustomEvent) {
    this.currentSlide = e.detail.index;
  }

  private setupThumbElements() {
    if (this.thumbnailsContainer) {
      this.thumbElements = Array.from(this.thumbnailsContainer.querySelectorAll('.thumb')) as HTMLElement[];
      
      this.thumbElements.forEach((thumb, index) => {
        thumb.addEventListener('touchstart', (e) => this.handleTouchStart(e, index), { passive: false });
        thumb.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        thumb.addEventListener('touchend', (e) => this.handleTouchEnd(e, index), { passive: false });
      });
    }
  }

  private cleanupEventListeners() {
    this.thumbElements.forEach(thumb => {
      thumb.removeEventListener('touchstart', this.handleTouchStart as any);
      thumb.removeEventListener('touchmove', this.handleTouchMove as any);
      thumb.removeEventListener('touchend', this.handleTouchEnd as any);
    });
  }

  protected firstUpdated() {
    this.setupThumbElements();
  }

  render() {
    if (this.imageUrls.length === 0) {
      return this.renderNoImages();
    }

    if (this.canEdit && !this.ownerAttrs) {
      return html`<p style="color: red">model-image not corrected init...</p>`;
    }

    return html`
      <sl-carousel 
        @sl-change=${this.slideChanged} 
        loop 
        navigation
      >
        ${this.imageUrls.map(url => html`
          <sl-carousel-item>
            <img src=${url} alt="" role="presentation" />
          </sl-carousel-item>
        `)}
      </sl-carousel>
      
      <div 
        class="thumbnails" 
        ${ref((el) => { this.thumbnailsContainer = el as HTMLDivElement })}
      >
        ${this.dropIndicatorPos ? html`
          <div 
            class="drop-indicator" 
            style="left: ${this.dropIndicatorPos.x}px"
          ></div>
        ` : ''}
        
        ${this.imageUrls.map((url, i) => html`
          <button
            type="button"
            class="thumb-button
              ${this.selectedIndex === i ? 'selected' : ''}
              ${this.dragIndex === i ? 'dragging' : ''}
              ${this.dropTargetIndex === i && this.dragIndex !== i ? 'drop-target' : ''}
            "
            @click=${() => this.canEdit && this.toggleSelection(i)}
            @dragstart=${(e: DragEvent) => this.canEdit && this.handleDragStart(e, i)}
            @dragend=${this.handleDragEnd}
            @dragover=${(e: DragEvent) => this.canEdit && this.handleDragOver(e, i)}
            @dragleave=${() => this.dropTargetIndex = null}
            @drop=${(e: DragEvent) => this.canEdit && this.handleDrop(e, i)}
            @touchstart=${(e: TouchEvent) => this.canEdit && this.handleTouchStart(e, i)}
            @touchmove=${(e: TouchEvent) => this.canEdit && this.handleTouchMove(e)}
            @touchend=${(e: TouchEvent) => this.canEdit && this.handleTouchEnd(e, i)}
          >
            <img
              src=${url}
              class="thumb-image"
              alt="Миниатюра ${i + 1}"
              draggable=${this.canEdit}
            />
          </button>
        `)}
      </div>

      ${this.canEdit ? html`
        <div class="button-bar">
          ${this.renderAddImageButton()}
          ${this.selectedIndex !== null ? html`
            ${this.renderDeletemageButton()}
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  protected renderNoImages(): TemplateResult {
      return html`
        <sl-carousel loop navigation>
          <sl-carousel-item>
            <div class="empty-carousel-item">
              Фотографии не загружены
            </div>
          </sl-carousel-item>
        </sl-carousel>
        
        ${this.canEdit ? html`
          <div class="button-bar">${this.renderAddImageButton()}</div>
        ` : ''}
      `;
  }

  protected renderAddImageButton(): TemplateResult {
    return html`
      <sl-icon-button
        class="add-btn"
        name="plus-square"
        label="Добавить"
        tabindex="0"
        @click=${this.openFileDialog}
        @keydown=${(e: KeyboardEvent) => this.handleKeyAction(e, this.openFileDialog)}
      ></sl-icon-button>
    `
  }

  protected renderDeletemageButton(): TemplateResult {
    return html`
      <sl-icon-button
        class="delete-btn"
        name="x-square"
        label="Удалить"
        tabindex="0"
        @click=${this.confirmDelete}
        @keydown=${(e: KeyboardEvent) => this.handleKeyAction(e, this.confirmDelete)}
      ></sl-icon-button>
    `
  }
}

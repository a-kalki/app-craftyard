import { html, css, nothing, type PropertyValues } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import { fileApi } from 'src/files/ui/files-api-local';
import { imageUtils } from '#app/ui/utils/image';

@customElement('model-images')
export class ModelImagesEntity extends BaseElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      max-height: 60vh;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .wrapper {
      position: relative;
      width: 100%;
      height: 100%;
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
      object-fit: contain; /* или cover, если нужно обрезание */
    }

    .thumbnails {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .thumb {
      width: 48px;
      height: 48px;
      object-fit: cover;
      border-radius: 4px;
      cursor: grab;
      border: 2px solid transparent;
      transition: border 0.2s ease-in-out;
    }

    .thumb:hover {
      border-color: var(--sl-color-primary-500);
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

    input[type="file"] {
      display: none;
    }

    sl-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .no-images {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--sl-color-gray-500);
      font-style: italic;
    }
  `;

  @property({ type: Array }) imageIds: string[] = [];
  @property({ type: Boolean }) canEdit = false;

  @state() private imageUrls: string[] = [];
  @state() private isUploading = false;
  @state() private uploadProgress = 0;

  private draggedIndex: number | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadImages();
  }

  updated(changed: PropertyValues) {
    console.log('prop changed', changed);
    if (changed.has('imageIds')) {
      this.loadImages();
    }
  }

  private async loadImages() {
    const urls: string[] = [];
    for (const id of this.imageIds) {
      const result = await fileApi.getFile(id);
      if (result.isSuccess()) urls.push(result.value.url);
    }
    this.imageUrls = urls;
  }

  private async openFileDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.addEventListener('change', async () => {
      const files = input.files ? Array.from(input.files) : [];
      if (files.length === 0) return;

      this.isUploading = true;
      let addedIds: string[] = [];

      for (const file of files) {
        this.uploadProgress = 0;

        const compressedFile = await imageUtils.compressImage(file, 0.7, 1920);

        const result = await fileApi.uploadFile({
          file: compressedFile,
          access: { type: 'public' },
          subDir: 'model-images',
          onProgress: (p: number) => this.uploadProgress = p,
        });

        if (result.isSuccess()) {
          addedIds.push(result.value.id);
        } else {
          this.app.error('Ошибка при загрузке файла', { file });
        }
      }

      this.uploadProgress = 100;
      this.isUploading = false;

      this.dispatchEvent(new CustomEvent('add-images', {
        detail: { imageIds: addedIds },
        bubbles: true,
        composed: true,
      }));
    });
    input.click();
  }

  private async confirmDeleteCurrentImage() {
    const carousel = this.renderRoot.querySelector('sl-carousel') as any;
    const index = carousel?.activeSlide || 0;
    const imageId = this.imageIds[index];

    const confirmed = await this.app.showDialog({
      title: 'Удаление фотографии.',
      content: 'Вы уверены, что хотите удалить текущую фотографию?',
      confirmText : 'Удалить',
      confirmVariant: 'danger',
      cancelText: 'Отмена',
    });
    if (!confirmed) return;

    this.dispatchEvent(new CustomEvent('delete-image', {
      detail: { imageId },
      bubbles: true,
      composed: true,
    }));
  }

  private handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  private handleDragStart(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    this.draggedIndex = Number(target.dataset.index);
    e.dataTransfer?.setData('text/plain', String(this.draggedIndex));
  }

  private handleDrop(e: DragEvent) {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const targetIndex = Number(target.dataset.index);
    const fromIndex = Number(e.dataTransfer?.getData('text/plain'));

    if (fromIndex === targetIndex || isNaN(fromIndex)) return;

    const newOrder = [...this.imageIds];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(targetIndex, 0, moved);

    this.imageIds = newOrder;
    this.imageUrls = newOrder.map(id => {
      const i = this.imageIds.indexOf(id);
      return this.imageUrls[i];
    });
  }

  protected updateUrls(targetIndex: number): void {
    const newImageIds = [...this.imageIds];
    const [movedId] = newImageIds.splice(this.draggedIndex!, 1);
    newImageIds.splice(targetIndex, 0, movedId);

    this.imageIds = newImageIds;

    // Переставить imageUrls в том же порядке
    this.imageUrls = newImageIds.map(id => {
      const i = this.imageIds.indexOf(id);
      return this.imageUrls[i];
    });

    this.draggedIndex = null;
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.imageUrls.length === 0
          ? html`<div class="no-images">Фотографии не загружены</div>`
          : html`
              <sl-carousel loop navigation>
                ${this.imageUrls.map(url => html`
                  <sl-carousel-item>
                    <img src=${url} />
                  </sl-carousel-item>
                `)}
              </sl-carousel>

              <div class="thumbnails">
                ${this.imageUrls.map((url, index) => html`
                  <img
                    src=${url}
                    class="thumb"
                    draggable="true"
                    data-index=${index}
                    @dragstart=${this.handleDragStart}
                    @dragover=${(e: DragEvent) => e.preventDefault()}
                    @drop=${this.handleDrop}
                  />
                `)}
              </div>
            `}


        ${this.canEdit ? html`
          <div class="button-bar">
            <sl-icon-button
              class="add-btn"
              name="plus-square"
              label="Добавить"
              @click=${this.openFileDialog}>
            </sl-icon-button>
            ${this.imageUrls.length > 0 ? html`
              <sl-icon-button
                class="delete-btn"
                name="x-square"
                label="Удалить"
                @click=${this.confirmDeleteCurrentImage}>
              </sl-icon-button>
            `: nothing}
          </div>
        ` : nothing}

        ${this.isUploading
          ? html`
              <sl-progress-bar
                .value=${this.uploadProgress}
                ?indeterminate=${this.uploadProgress === 0}>
              </sl-progress-bar>
            ` : nothing}
      </div>
    `;
  }
}

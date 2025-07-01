import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import { createRef, ref } from 'lit/directives/ref.js';
import { imageUtils } from '#app/ui/utils/image';
import type { UploadFileInput } from '#files/domain/struct/upload-file/contract';
import type { CyOwnerAggregateAttrs } from '#app/domain/types';

type CompressionMode = 'low' | 'medium' | 'high';

@customElement('single-image-upload')
export class SingleImageUpload extends BaseElement {
  static styles = css`
    :host {
      display: block;
    }

    .wrapper {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .input-column {
      flex: 1;
      min-width: 200px;
    }

    .preview {
      max-width: 64px;
      max-height: 64px;
      border: 1px solid var(--sl-color-gray-200);
      border-radius: var(--sl-border-radius-medium);
      object-fit: contain;
    }
  `;

  @property({ type: Object }) ownerAttrs!: CyOwnerAggregateAttrs;
  @property({ type: String }) compression: CompressionMode = 'medium';
  @property({ type: Number }) aspectRatio?: number;
  @property({ type: String }) url?: string;

  private fileInput = createRef<HTMLInputElement>();
  private isUploading = false;

  render() {
    if (!this.ownerAttrs) return '';

    return html`
      <div class="wrapper">
        <div class="input-column">
          <sl-input
            label="URL изображения"
            placeholder="https://example.com/image.jpg"
            ?disabled=${this.isUploading}
            .value=${this.url ?? ''}
            @sl-input=${(e: Event) => this.url = (e.target as HTMLInputElement).value}
          >
            <sl-icon-button
              slot="suffix"
              name="file-earmark-image"
              label="Загрузить с диска"
              ?disabled=${this.isUploading}
              @click=${() => this.fileInput.value?.click()}
            ></sl-icon-button>
          </sl-input>
        </div>

        ${this.url
          ? html`<img
            @load=${() => this.handleImageLoaded(true)}
            @error=${() => this.handleImageLoaded(false)}
            class="preview" src=${this.url} alt="Preview"
          >`
          : null}
      </div>

      <input
        type="file"
        accept="image/*"
        hidden
        @change=${this.handleFileSelected}
        ${ref(this.fileInput)}
      >
    `;
  }

  private handleImageLoaded(isValid: boolean): void {
    this.dispatchEvent(new CustomEvent<{ isValid: boolean, url: string }>(
      'image-loaded',
      {
        detail: { isValid, url: this.url ?? '' },
        bubbles: true,
        composed: true,
      }
    ));
  }

  private async handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.isUploading = true;
    try {
      const quality = this.getCompressionQuality(this.compression);
      const compressed = await imageUtils.compressImage(file, quality, 1920, this.aspectRatio);

      const uploadInput: UploadFileInput = {
        ...this.ownerAttrs,
        file: compressed,
      };
      const result = await this.fileApi.uploadFile(uploadInput);
      if (result.isFailure()) {
        this.app.error(`[${this.constructor.name}]: не удалось загрузить файл.`, {
          ownerAttrs: this.ownerAttrs,
          file: { size: compressed.size, type: compressed.type, name: compressed.name }
        });
        return;
      }

      this.url = result.value.url;
    } catch (err) {
      this.app.error('Ошибка при обработке изображения', { err });
    } finally {
      this.isUploading = false;
    }
  }

  private getCompressionQuality(mode: CompressionMode): number {
    switch (mode) {
      case 'low': return 0.5;
      case 'high': return 0.9;
      case 'medium':
      default: return 0.7;
    }
  }
}

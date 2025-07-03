import { html, css, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseFileUpload } from './base-file-upload';
import { imageUtils } from '#app/ui/utils/image';

type CompressionMode = 'low' | 'medium' | 'high';

@customElement('image-upload-input')
export class ImageUploadInput extends BaseFileUpload {
  static styles = [
    BaseFileUpload.styles,
    css``,
  ];

  @property({ type: String }) compression: CompressionMode = 'medium';
  @property({ type: Number }) aspectRatio?: number;
  @property({ type: Number }) maxWidth?: number;

  constructor() {
    super();
    this.label = 'URL изображения';
    this.fileAccept = 'image/*';
    this.uploadIcon = 'image';
  }

  protected renderPreview(): TemplateResult | null {
    if (!this.url) return null;
    // События @load/@error будут вызваны браузером, но мы их не перехватываем,
    // так как "валидность URL" теперь определяется только успешной загрузкой через API.
    return html`<img class="preview" src=${this.url} alt="Предпросмотр">`;
  }

  protected async processFileBeforeUpload(file: File): Promise<File | null> {
    const quality = this.getCompressionQuality(this.compression);
    const compressed = await imageUtils.compressImage(file, quality, this.maxWidth, this.aspectRatio);
    return compressed;
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

declare global {
  interface HTMLElementTagNameMap {
    'image-uploadkinput': ImageUploadInput;
  }
}

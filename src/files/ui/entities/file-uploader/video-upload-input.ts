import { html, css, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseFileUpload } from './base-file-upload';

@customElement('video-upload-input')
export class VideoUploadInput extends BaseFileUpload {
  static styles = [
    BaseFileUpload.styles,
    css`
      .preview {
        max-width: 120px;
        max-height: 64px;
        width: auto;
        height: auto;
        border: 1px solid var(--sl-color-gray-200);
        border-radius: var(--sl-border-radius-medium);
        object-fit: contain;
      }
    `
  ];

  constructor() {
    super();
    this.label = 'URL видео';
    this.fileAccept = 'video/*';
    this.uploadIcon = 'play-btn';
  }

  protected renderPreview(): TemplateResult | null {
    if (!this.url) return null;
    return html`
      <video
        class="preview"
        src=${this.url}
        controls
        preload="metadata"
      ></video>
    `;
  }

  protected async processFileBeforeUpload(file: File): Promise<File | null> {
    return file;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'video-upload-input': VideoUploadInput;
  }
}

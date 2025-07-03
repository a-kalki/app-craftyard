import { html, css, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseFileUpload } from './base-file-upload';

@customElement('pdf-upload-input')
export class PdfUploadInput extends BaseFileUpload {
  static styles = [
    BaseFileUpload.styles,
    css`
      .preview {
        max-width: 64px;
        max-height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: var(--sl-color-primary-500);
        background: var(--sl-color-primary-50);
        border: 1px solid var(--sl-color-primary-200);
      }
    `
  ];

  constructor() {
    super();
    this.label = 'URL PDF-файла';
    this.fileAccept = 'application/pdf';
    this.uploadIcon = 'file-earmark-pdf';
  }

  protected renderPreview(): TemplateResult | null {
    if (!this.url) return null;
    return html`
      <a href=${this.url} target="_blank" class="preview" title="Открыть PDF">
        <sl-icon name="file-earmark-pdf"></sl-icon>
      </a>
    `;
  }

  protected async processFileBeforeUpload(file: File): Promise<File | null> {
    return file;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pdf-upload-input': PdfUploadInput;
  }
}

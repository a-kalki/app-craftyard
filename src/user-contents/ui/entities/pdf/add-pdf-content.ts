import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import type { FileType } from "#user-contents/domain/content/struct/file-attrs";
import { BaseAddFileModal } from "../base-content/add-file-content";

@customElement('add-pdf-modal')
export class AddPdfModal extends BaseAddFileModal {
  protected fileType: FileType = 'PDF';

  protected renderFileUpload(): TemplateResult {
    return html`
      <pdf-upload-input
        label="PDF файл"
        placeholder="URL PDF файла"
        .ownerAttrs=${this.ownerAttrs}
        .url=${this.fileUrl}
        @file-id-changed=${
          (e: CustomEvent<{url: string, id: string}>) => this.handleFileUrlChanged('fileId', e)
        }
      ></pdf-upload-input>
      ${this.renderFieldErrors('fileId')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-pdf-modal': AddPdfModal;
  }
}

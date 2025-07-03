import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import type { FileType } from "#user-contents/domain/content/struct/file-attrs";
import { BaseAddFileModal } from "../base-content/add-file-content";

@customElement('add-video-modal')
export class AddVideoModal extends BaseAddFileModal {
  protected fileType: FileType = 'VIDEO';

  protected renderFileUpload(): TemplateResult {
    return html`
      <video-upload-input
        label="Видео файл"
        placeholder="URL видео файла"
        .ownerAttrs=${this.ownerAttrs}
        .url=${this.fileUrl}
        @file-id-changed=${
          (e: CustomEvent<{url: string, id: string}>) => this.handleFileUrlChanged('fileId', e)
        }
        clearable
      ></video-upload-input>
      ${this.renderFieldErrors('fileId')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-video-modal': AddVideoModal;
  }
}

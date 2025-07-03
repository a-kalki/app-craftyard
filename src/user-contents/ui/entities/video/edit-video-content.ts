import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import type { FileContent } from "#user-contents/domain/content/struct/file-attrs";
import { editFileContentVmap } from "#user-contents/domain/content/struct/edit-content/v-map";
import { BaseEditContentModal } from "../base-content/edit-content";
import type { EditFileContentAttrs } from "#user-contents/domain/content/struct/edit-content/contract";
import type { PatchValue } from "rilata/core";

@customElement('edit-video-modal')
export class EditVideoModal extends BaseEditContentModal<EditFileContentAttrs> {

  protected getFormData(content: FileContent): PatchValue<Omit<FileContent, "createAt" | "updateAt">> {
    return {
      id: content.id,
      sectionId: content.sectionId,
      title: content.title,
      type: "FILE",
      fileType: "VIDEO",
      fileId: content.fileId,
      description: content.description,
      thumbnailId: content.thumbnailId,
      footer: content.footer,
      order: content.order,
      icon: content.icon,
    }
  }

  protected validatorMap = editFileContentVmap;

  protected handleFileUpload(e: CustomEvent<{ id: string }>, field: 'fileId' | 'thumbnailId'): void {
    this.setFieldValue(field, e.detail.id);
  }

  protected renderContentFields(): TemplateResult {
    return html`
      <video-upload-input
        label="Видео файл"
        placeholder="Выберите файл"
        .ownerAttrs=${this.ownerAttrs}
        .fileId=${this.formData.fileId ?? ''}
        @file-id-changed=${(e: CustomEvent<{id: string}>) => this.handleFileUpload(e, 'fileId')}
        clearable
      ></video-upload-input>
      ${this.renderFieldErrors('fileId')}

      <sl-textarea
        label="Описание (необязательно)"
        help-text="Описание для файла."
        rows="10"
        ?disabled=${this.isLoading}
        .value=${this.formData.description ?? ''}
        @sl-input=${this.createValidateHandler('description')}
      ></sl-textarea>
      ${this.renderFieldErrors('description')}

      <image-upload-input
        label="Файл миниатюры"
        placeholder="Выберите миниатюру файла"
        compression="high"
        maxWidth="600"
        .ownerAttrs=${this.ownerAttrs}
        .fileId=${this.formData.thumbnailId ?? ''}
        @file-id-changed=${(e: CustomEvent<{id: string}>) => this.handleFileUpload(e, 'thumbnailId')}
        clearable
      ></image-upload-input>
      ${this.renderFieldErrors('thumbnailId')}
      `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-video-modal': EditVideoModal;
  }
}

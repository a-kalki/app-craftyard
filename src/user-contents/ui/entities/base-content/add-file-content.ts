import { html, type TemplateResult } from "lit";
import { addFileContentVmap } from "#user-contents/domain/content/struct/add-content/v-map";
import { BaseAddContentModal } from "../base-content/add-content-modal";
import type { AddFileContentAttrs } from "#user-contents/domain/content/struct/add-content/contract";
import type { FileType } from "#user-contents/domain/content/struct/file-attrs";
import { state } from "lit/decorators.js";
import type { CyOwnerAggregateAttrs } from "#app/domain/types";

export abstract class BaseAddFileModal extends BaseAddContentModal<AddFileContentAttrs> {
  protected abstract fileType: FileType;

  @state() fileUrl?: string;
  @state() thumbnailUrl?: string;

  protected validatorMap = addFileContentVmap;

  protected createDefaultContent(): AddFileContentAttrs {
    return {
      fileId: '',
      sectionId: this.sectionId,
      type: 'FILE',
      fileType: this.fileType,
      title: '',
      description: '',
      footer: undefined,
      order: undefined,
      icon: undefined,
    };
  }

  protected handleFileUrlChanged(
    field: 'fileId' | 'thumbnailId',
    e: CustomEvent<{ id: string, url: string }>
  ): void {
    this.setFieldValue(field, e.detail.id);

    if (field === 'fileId') this.fileUrl = e.detail.url;
    else this.thumbnailUrl = e.detail.url;

    e.preventDefault();
  }

  protected renderSpecificFields(): TemplateResult {
    const thumbOwnerAttrs: CyOwnerAggregateAttrs = { ...this.ownerAttrs, access: 'public' };
    return html`
      ${this.renderFileUpload()}
      <sl-textarea
        label="Описание (необязательно, Markdown)"
        help-text="Дополнительное описание файла"
        rows=5
        .value=${this.commandBody.description ?? ''}
        @sl-input=${this.createValidateHandler('description')}
      ></sl-textarea>
      ${this.renderFieldErrors('description')}

      <image-upload-input
        label="Предпросмотр (необязательно)"
        placeholder="Добавьте миниатюру для файла."
        .ownerAttrs=${thumbOwnerAttrs}
        .url=${this.thumbnailUrl}
        @file-id-changed=${
          (e: CustomEvent<{url: string, id: string}>) => this.handleFileUrlChanged('thumbnailId', e)
        }
      ></image-upload-input>
      ${this.renderFieldErrors('thumbnailId')}
    `;
  }

  protected abstract renderFileUpload(): TemplateResult;
}

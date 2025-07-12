import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import type { ImagesContent } from "#user-contents/domain/content/struct/images-attrs";
import { BaseEditContentModal } from "../base-content/edit-content";
import type { EditImagesContentAttrs } from "#user-contents/domain/content/struct/edit-content/contract";
import type { PatchValue } from "rilata/core";
import { editImagesContentVmap } from "#user-contents/domain/content/struct/edit-content/v-map";

@customElement('edit-images-modal')
export class EditImagesModal extends BaseEditContentModal<EditImagesContentAttrs> {

  protected getFormData(content: ImagesContent): PatchValue<EditImagesContentAttrs> {
    return {
      id: content.id,
      sectionId: content.sectionId,
      title: content.title,
      type: "IMAGES",
      imageIds: content.imageIds,
      description: content.description,
      footer: content.footer,
      order: content.order,
      icon: content.icon,
    };
  }

  protected validatorMap = editImagesContentVmap;

  protected renderContentFields(): TemplateResult {
    const imageIds = (this.formData.imageIds || [])
      .map(id => `ID: ${id}`)
      .join(', ');

    return html`
      <sl-input
        label="Идентификаторы изображений"
        help-text="Идентификаторы файлов изображений (нередактируемо здесь, используйте галерею для управления)"
        .value=${imageIds}
        readonly
        ?disabled=${this.isLoading}
      ></sl-input>

      <sl-textarea
        label="Описание (необязательно)"
        help-text="Описание для галереи изображений."
        rows="5"
        ?disabled=${this.isLoading}
        .value=${this.formData.description ?? ''}
        @sl-input=${this.createValidateHandler('description')}
      ></sl-textarea>
      ${this.renderFieldErrors('description')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-images-modal': EditImagesModal;
  }
}

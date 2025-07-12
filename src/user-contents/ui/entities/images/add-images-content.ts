import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { addImagesContentVmap } from "#user-contents/domain/content/struct/add-content/v-map";
import { BaseAddContentModal } from "../base-content/add-content-modal";
import type { AddImagesContentAttrs } from "#user-contents/domain/content/struct/add-content/contract";

@customElement('add-images-modal')
export class AddImagesModal extends BaseAddContentModal<AddImagesContentAttrs> {
  protected validatorMap = addImagesContentVmap;

  protected createDefaultContent(): AddImagesContentAttrs {
    return {
      sectionId: this.sectionId,
      type: 'IMAGES',
      title: '',
      imageIds: [],
      description: undefined,
      footer: undefined,
      order: undefined,
      icon: undefined,
    };
  }

  protected renderSpecificFields(): TemplateResult {
    return html`
      <sl-textarea
        label="Описание (необязательно, Markdown)"
        help-text="Описание для галереи изображений."
        rows="5"
        .value=${this.formData.description ?? ''}
        @sl-input=${this.createValidateHandler('description')}
      ></sl-textarea>
      ${this.renderFieldErrors('description')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-images-modal': AddImagesModal;
  }
}

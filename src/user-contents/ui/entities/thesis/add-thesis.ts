import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import type { AddThesisAttrs } from "#user-contents/domain/content/struct/add-content/contract";
import { addThesisContentVmap } from "#user-contents/domain/content/struct/add-content/v-map";
import { BaseAddContentModal } from "../base-content/add-content-modal";

@customElement('add-thesis-modal')
export class AddThesisModal extends BaseAddContentModal<AddThesisAttrs> {
  protected validatorMap = addThesisContentVmap;

  protected createDefaultContent(): AddThesisAttrs {
    return {
      sectionId: this.sectionId,
      type: 'THESIS',
      title: '',
      body: '',
      footer: undefined,
      order: undefined,
      icon: undefined,
    };
  }

  protected renderSpecificFields(): TemplateResult {
    return html`
      <sl-textarea
        label="Основной текст (Markdown)"
        help-text="Содержание тезиса"
        rows=10
        .value=${this.formData.body ?? ''}
        @sl-input=${this.createValidateHandler('body')}
      ></sl-textarea>
      ${this.renderFieldErrors('body')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-thesis-modal': AddThesisModal;
  }
}

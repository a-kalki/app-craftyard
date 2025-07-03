import type { EditThesistAttrs } from "#user-contents/domain/content/struct/edit-content/contract";
import { editThesisContentVmap } from "#user-contents/domain/content/struct/edit-content/v-map";
import type { ThesisContent } from "#user-contents/domain/content/struct/thesis-attrs";
import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { BaseEditContentModal } from "../base-content/edit-content";
import type { PatchValue } from "rilata/core";

@customElement('edit-thesis-modal')
export class EditThesisModal extends BaseEditContentModal<EditThesistAttrs> {

  protected validatorMap = editThesisContentVmap;

  protected getFormData(thesis: ThesisContent): PatchValue<Omit<ThesisContent, "createAt" | "updateAt">> {
    return {
      id: thesis.id,
      sectionId: thesis.sectionId,
      type: "THESIS",
      title: thesis.title,
      body: thesis.body,
      footer: thesis.footer,
      order: thesis.order,
      icon: thesis.icon,
    }
  }

  protected renderContentFields(): TemplateResult {
    return html`
      <sl-textarea
        label="Основной текст (Markdown)"
        help-text="Раскройте свой тезис."
        ?disabled=${this.isLoading}
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
    'edit-thesis-modal': EditThesisModal;
  }
}

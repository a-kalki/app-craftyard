import type { CyOwnerAggregateAttrs } from "#app/domain/types";
import { ValidatableElement } from "#app/ui/base/validatable-element";
import type { AddUserContentCommand } from "#user-contents/domain/content/struct/add-content/contract";
import { css, html, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { AddUserContentModalDialog } from "./types";

export abstract class BaseAddContentModal<T extends AddUserContentCommand['attrs']>
  extends ValidatableElement<T>
  implements AddUserContentModalDialog
{
  static styles = css`
    sl-dialog::part(panel) {
      width: min(90vw, 800px);
      max-height: 90vh;
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;

  protected sectionId!: string;
  @state() protected isLoading = false;
  @state() protected formData!: T;

  protected ownerAttrs!: CyOwnerAggregateAttrs;

  protected iconIsValid: boolean = false;

  private resolve?: (result: { contentId: string } | null) => void;

  protected abstract createDefaultContent(): T;

  protected abstract renderSpecificFields(): TemplateResult;

  async show(
    sectionId: string,
    ownerAttrs: CyOwnerAggregateAttrs
  ): Promise<{ contentId: string } | null> {
    this.sectionId = sectionId;
    this.ownerAttrs = ownerAttrs;
    this.formData = this.createDefaultContent();
    this.open = true;
    this.isLoading = false;

    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  protected async save() {
    if (!this.validateAll()) {
      this.app.error('Необходимо ввести корректные данные.', { errors: this.fieldErrors });
      return;
    }
    this.isLoading = true;

    try {
      const command = this.getCommandToApi();
      const addResult = await this.userContentApi.addContent(command);
      if (addResult.isFailure()) {
        this.app.error(`Не удалось добавить контент.`, {
          attrs: this.formData, result: addResult.value,
        });
        return;
      }

      if (this.resolve) {
        this.resolve({ contentId: addResult.value.contentId });
      }
      this.hide();
    } catch (err) {
      this.app.error(`Ошибка при добавлении контента`, {
        attrs: this.formData, error: err
      });
    } finally {
      this.isLoading = false;
    }
  }

  protected getCommandToApi(): AddUserContentCommand['attrs'] {
      const contentToSave = { ...this.formData };
      if (!this.iconIsValid) {
        delete contentToSave.icon;
      }

      return contentToSave;
  }

  protected hide() {
    this.open = false;
    if (this.resolve) {
      this.resolve(null);
      this.resolve = undefined;
    }
    if (document.body.contains(this)) {
      document.body.removeChild(this);
    }
  }

  protected handleIconUpdated(e: CustomEvent<{ isValid: boolean, name: string }>): void {
    this.iconIsValid = e.detail.isValid;
    this.formData.icon = e.detail.name;
    e.preventDefault();
    this.requestUpdate();
  }

  protected getFieldValue(field: keyof T): unknown {
    return this.formData[field]
  }
  protected setFieldValue(field: keyof T, value: unknown): void {
    this.formData = { ...this.formData, [field]: value };
  }

  render() {
    return html`
      <sl-dialog
        label=${`Добавление контента`}
        ?open=${this.open}
        @sl-request-close=${this.hide}
        style="--width: 500px;"
      >
        <div class="editor-container">
          ${this.rendernPreviousFields()}
          ${this.renderSpecificFields()}
          ${this.renderPostFields()}
        </div>

        <sl-button slot="footer" @click=${this.hide}>Отмена</sl-button>
        <sl-button 
          slot="footer" 
          variant="primary" 
          ?disabled=${!this.validateAll()}
          @click=${this.save}
          ?loading=${this.isLoading}
        >
          Создать
        </sl-button>
      </sl-dialog>
    `;
  }

  protected rendernPreviousFields(): TemplateResult {
    return html`
      <sl-input
        label="Заголовок карточки"
        help-text="Основное название"
        .value=${this.formData.title ?? ''}
        @sl-input=${this.createValidateHandler('title')}
      ></sl-input>
      ${this.renderFieldErrors('title')}
    `;
  }

  protected renderPostFields(): TemplateResult {
    return html`
      <sl-input
        label="Футер (необязательно)"
        help-text="Дополнительная информация в подвале карточки"
        .value=${this.formData.footer || ''}
        @sl-input=${this.createValidateHandler('footer')}
      ></sl-input>
      ${this.renderFieldErrors('footer')}

      <sl-input
        label="Порядковый номер (необязательно)"
        help-text="Управляйте порядком отображения"
        type="number"
        .value=${this.formData.order?.toString() || ''}
        @sl-input=${this.createValidateHandler('order')}
      ></sl-input>
      ${this.renderFieldErrors('order')}

      <icon-picker
        label="Иконка"
        value=${this.formData.icon ?? ''}
        ?disabled=${this.isLoading}
        @sl-change=${this.createValidateHandler('icon')}
        @icon-updated=${this.handleIconUpdated}
      ></icon-picker>
      ${this.renderFieldErrors('icon')}
    `;
  }
}

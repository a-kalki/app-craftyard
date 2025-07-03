import { ValidatableElement } from "#app/ui/base/validatable-element";
import { css, html, type TemplateResult, type CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";
import type { CyOwnerAggregateAttrs } from "#app/domain/types";
import type { UserContent } from "#user-contents/domain/content/meta";
import type { EditUserContentCommand } from "#user-contents/domain/content/struct/edit-content/contract";
import type { EditUserContentModalDialog } from "./types";

type BaseEditContentAttrs = EditUserContentCommand['attrs'];

/**
 * Абстрактный базовый класс для модальных окон редактирования контента.
 * Предоставляет общую логику открытия/закрытия, сохранения, валидации
 * и работы с данными формы.
 */
export abstract class BaseEditContentModal<T extends BaseEditContentAttrs>
  extends ValidatableElement<T>
  implements EditUserContentModalDialog
{
  static styles: CSSResultGroup = css`
    sl-dialog::part(panel) {
      width: min(90vw, 800px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    sl-dialog::part(body) {
      flex-grow: 1;
      overflow-y: auto; /* Позволяет прокручивать содержимое диалога */
      padding-bottom: 1rem; /* Добавляем отступ снизу для красоты */
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

  @property({ type: Object }) initedValues!: T;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() protected isLoading = false;
  @state() protected formData!: T;

  protected resolve?: (value: 'success' | null) => void;

  protected ownerAttrs!: CyOwnerAggregateAttrs;

  protected abstract getFormData(content: UserContent): T;

  protected abstract renderContentFields(): TemplateResult;

  /**
   * Открывает модальное окно с данными для редактирования.
   * @param content Данные контента для редактирования.
   * @returns Promise, который разрешится 'success' при успешном сохранении или 'null' при отмене/закрытии.
   */
  async show(content: UserContent, ownerAttrs: CyOwnerAggregateAttrs): Promise<'success' | null> {
    this.formData = this.getFormData(content);
    this.initedValues = { ...this.formData };
    this.ownerAttrs = ownerAttrs
    this.open = true;
    this.isLoading = false;

    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  /**
   * Проверяет, были ли внесены изменения в форму по сравнению с исходными данными.
   * Дочерние классы могут переопределить для более специфичной логики сравнения.
   */
  protected hasChanged(): boolean {
    const keysLengthNotEqual = Object.keys(this.initedValues).length !== Object.keys(this.formData).length;
    const valuesIsNotEqual = Object.entries(this.initedValues)
      .some(([key, value]) => value !== this.formData[key as keyof T])
    return keysLengthNotEqual || valuesIsNotEqual;
  }

  /**
   * Проверяет, можно ли сохранить данные (валидация + наличие изменений).
   */
  protected saveable(): boolean {
    return this.validateAll() && this.hasChanged();
  }


  private async save() {
    if (!this.saveable()) {
      this.app.error('Необходимо внести изменения или ввести корректные данные.', { errors: this.fieldErrors });
      return;
    }
    this.isLoading = true;

    try {
      const attrs = { ...this.formData };
      if (!this.iconIsValid) {
        delete attrs.icon;
      }
      const success = await this.userContentApi.editContent(attrs);

      if (success && this.resolve) {
        this.resolve('success');
      } else if (!success) {
         this.app.error('Не удалось обновить контент.');
      }
      this.hide();
    } catch (err) {
      this.app.error(`Ошибка при обновлении контента`, {
        attrs: this.formData,
        error: err
      });
    } finally {
      this.isLoading = false;
    }
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

  protected iconIsValid: boolean = true;

  protected handleIconUpdated(e: CustomEvent<{ isValid: boolean, name: string }>): void {
    this.iconIsValid = e.detail.isValid;
    this.formData.icon = e.detail.name;
    this.requestUpdate();
  }

  render() {
    return html`
      <sl-dialog
        label="Редактирование контента"
        ?open=${this.open}
        @sl-request-close=${this.hide}
      >
        <div class="editor-container">
          ${this.renderHeader()}
          ${this.renderContentFields()}
          ${this.renderFooter()}
          ${this.renderOtherFields()}
        </div>

        <sl-button slot="footer" ?disabled=${this.isLoading} @click=${this.hide}>Отмена</sl-button>
        <sl-button
          slot="footer"
          variant="primary"
          ?disabled=${!this.saveable()}
          ?loading=${this.isLoading}
          @click=${this.save}
        >
          Сохранить
        </sl-button>
      </sl-dialog>
    `;
  }

  renderHeader(): TemplateResult {
    return html`
      <sl-input
        label="Заголовок карточки"
        help-text="О чем ваш тезис?"
        ?disabled=${this.isLoading}
        .value=${this.formData.title ?? ''}
        @sl-input=${this.createValidateHandler('title')}
      ></sl-input>
      ${this.renderFieldErrors('title')}
    `;
  }

  renderFooter(): TemplateResult {
    return html`
      <sl-input
        label="Футер (необязательно)"
        help-text="При необходимости введите дополнительную информацию."
        ?disabled=${this.isLoading}
        .value=${this.formData.footer || ''}
        @sl-input=${this.createValidateHandler('footer')}
      ></sl-input>
      ${this.renderFieldErrors('footer')}
    `;
  }

  renderOtherFields(): TemplateResult {
    return html`
      <sl-input
        label="Порядковый номер карточки"
        help-text="Управляйте порядком отображения карточек."
        ?disabled=${this.isLoading}
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

  protected getFieldValue(field: keyof T): unknown {
    return this.formData[field];
  }

  protected setFieldValue(field: keyof T, value: unknown): void {
    if (this.formData[field] !== undefined && value === undefined) {
      value = null;
    }
    this.formData = { ...this.formData, [field]: value };
  }
}

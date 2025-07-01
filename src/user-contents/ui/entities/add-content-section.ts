import type { CyOwnerAggregateAttrs } from "#app/domain/types";
import { ValidatableElement } from "#app/ui/base/validatable-element";
import { type AddContentSectionCommand } from "#user-contents/domain/section/struct/add";
import { contentSectionVmap } from "#user-contents/domain/section/v-map";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type AddContentSectionType = Pick<AddContentSectionCommand['attrs'], 'title' | 'icon'>;

@customElement('add-content-section-modal')
export class AddContentSectionModal extends ValidatableElement<keyof AddContentSectionType> {
  @property({ type: Object }) ownerAttrs!: CyOwnerAggregateAttrs;
  @property({ type: Boolean, reflect: true }) open = false;;

  @state() private isLoading = false;
  @state() private formData: AddContentSectionType = {
    title: '',
    icon: '',
  }

  protected iconIsValid: boolean = false;

  static styles = css`
    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }
  `

  private resolve?: (value: string | null) => void;

  protected validatorMap = {
    title: contentSectionVmap.title,
    icon: contentSectionVmap.icon,
  };

  protected getFieldValue(field: keyof AddContentSectionType): unknown {
    return this.formData[field]
  }
  protected setFieldValue(field: keyof AddContentSectionType, value: unknown): void {
    this.formData = { ...this.formData, [field]: value };
  }

  async show(): Promise<string | null> {
    this.open = true;
    this.isLoading = false;
    
    // Добавляем модалку в DOM если ее там нет
    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }
    
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  async save(): Promise<void> {
    if (!this.validateAll()) {
      this.app.error('Необходимо ввести корректные данные.', { errors: this.fieldErrors });
      return;
    }

    this.isLoading = true;

    try {
      const attrs: AddContentSectionCommand['attrs'] = {
        ...this.ownerAttrs,
        title: this.formData.title,
        ...(this.iconIsValid && { icon: this.formData.icon })
      };

      const addResult = await this.contentSectionApi.addContentSection(attrs);
      
      if (addResult.isFailure()) {
        this.app.error(`Не удалось создать новый раздел: ${addResult.value}`, { result: addResult });
        return;
      }

      this.app.info('Раздел успешно добавлен');
      if (this.resolve) {
        this.resolve(addResult.value.id);
      }
      
      this.hide();
    } catch (error) {
      this.app.error('Ошибка при создании раздела', { error });
    } finally {
      this.isLoading = false;
    }
  }

  hide() {
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
  }

  render() {
    if (!this.open) return html``;

    return html`
      <sl-dialog
        label="Создание раздела"
        ?open=${this.open}
        @sl-request-close=${this.hide}
        style="--width: 500px;"
      >

        <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem 0;">
          <sl-input
            label="Название раздела"
            placeholder="Введите название"
            value=${this.formData.title ?? ''}
            @sl-input=${this.createValidateHandler('title')}
            ?disabled=${this.isLoading}
          ></sl-input>
          ${this.renderFieldErrors('title')}

          <icon-picker
            label="Иконка"
            value=${this.formData.icon ?? ''}
            @sl-change=${this.createValidateHandler('icon')}
            @icon-updated=${this.handleIconUpdated}
            ?disabled=${this.isLoading}
          ></icon-picker>
          ${this.renderFieldErrors('icon')}
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.5rem;" slot="footer">
          <sl-button
            @click=${this.hide}
            ?disabled=${this.isLoading}
          >
            Отмена
          </sl-button>
          <sl-button
            variant="primary"
            @click=${this.save}
            ?disabled=${!this.validateAll()}
            ?loading=${this.isLoading}
          >
            Создать
          </sl-button>
        </div>
      </sl-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-content-section-modal': AddContentSectionModal;
  }
}

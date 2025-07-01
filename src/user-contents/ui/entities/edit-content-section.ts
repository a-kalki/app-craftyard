import { ValidatableElement } from "#app/ui/base/validatable-element";
import { contentSectionVmap } from "#user-contents/domain/section/v-map";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ContentSectionAttrs } from "#user-contents/domain/section/struct/attrs";
import type { EditContentSectionCommand } from "#user-contents/domain/section/struct/edit";

type EditContentSectionType = EditContentSectionCommand['attrs'];

@customElement('content-section-edit-modal')
export class ContentSectionEditModal extends ValidatableElement<keyof EditContentSectionCommand['attrs']> {
  @property({ type: Object }) thesisSet!: ContentSectionAttrs;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private isLoading = false;
  @state() private formData: EditContentSectionType = {
    id: '',
    title: '',
    icon: '',
  };

  protected iconIsValid = true;

  static styles = css`
    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }
  `;

  private resolve?: (id: boolean) => void;

  protected validatorMap = {
    id: contentSectionVmap.id,
    title: contentSectionVmap.title,
    icon: contentSectionVmap.icon,
    order: contentSectionVmap.order,
  };

  protected getFieldValue(field: keyof Omit<EditContentSectionType, 'id'>): unknown {
    return this.formData[field];
  }

  protected setFieldValue(field: keyof Omit<EditContentSectionType, 'id'>, value: unknown): void {
    this.formData = { ...this.formData, [field]: value };
  }

  async show(thesisSet: ContentSectionAttrs): Promise<boolean> {
    this.formData = { 
      id: thesisSet.id,
      title: thesisSet.title,
      icon: thesisSet.icon ?? '',
      order: thesisSet.order
    };
    this.iconIsValid = !!thesisSet.icon;
    this.open = true;
    this.isLoading = false;
    
    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }
    
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  saveable(): boolean {
    const keysLengthNotEqual = Object.keys(this.thesisSet).length !== Object.keys(this.formData).length;
    const valuesIsNotEqual = Object.entries(this.thesisSet)
      .some(([key, value]) => value !== this.formData[key as keyof EditContentSectionType])
    return keysLengthNotEqual || valuesIsNotEqual;
  }

  async save(): Promise<void> {
    if (!this.validateAll()) {
      this.app.error('Необходимо ввести корректные данные.', { errors: this.fieldErrors });
      return;
    }

    this.isLoading = true;

    try {
      const attrs: EditContentSectionCommand['attrs'] = {
        ...this.thesisSet,
        ...this.formData,
        ...(this.iconIsValid && { icon: this.formData.icon })
      };

      const updateResult = await this.contentSectionApi.editContentSection(attrs);
      
      if (updateResult.isFailure()) {
        this.app.error(`Не удалось обновить раздел: ${updateResult.value}`, { result: updateResult });
        return;
      }

      this.app.info('Раздел успешно обновлен');
      if (this.resolve) {
        this.resolve(true);
      }
      
      this.hide();
    } catch (error) {
      this.app.error('Ошибка при обновлении раздела', { error });
    } finally {
      this.isLoading = false;
    }
  }

  hide() {
    this.open = false;
    if (this.resolve) {
      this.resolve(false);
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
        label="Редактирование раздела"
        ?open=${this.open}
        @sl-request-close=${this.hide}
        style="--width: 500px;"
      >
        <div style="display: flex; flex-direction: column; gap: 1rem; padding: 1rem 0;">
          <sl-input
            label="Название раздела"
            placeholder="Введите название"
            value=${this.formData.title}
            @sl-input=${this.createValidateHandler('title')}
            ?disabled=${this.isLoading}
          ></sl-input>
          ${this.renderFieldErrors('title')}

          <icon-picker
            label="Иконка"
            value=${this.formData.icon || ''}
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
            Сохранить
          </sl-button>
        </div>
      </sl-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'content-section-edit-modal': ContentSectionEditModal;
  }
}

import { ValidatableElement } from "#app/ui/base/validatable-element";
import type { Thesis } from "#user-contents/domain/thesis-set/struct/attrs";
import type { EditThesisCommand } from "#user-contents/domain/thesis-set/struct/thesis/edit";
import { thesisVmap } from "#user-contents/domain/thesis-set/v-map";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('edit-thesis-modal')
export class EditThesisModal extends ValidatableElement<keyof Thesis> {
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

  @property({ type: Object }) thesis!: Thesis;
  @property({ type: String }) thesisSetId: string = '';
  @property({ type: Boolean, reflect: true }) open = false;

  protected validatorMap = thesisVmap;

  @state() private isLoading = false;
  @state() private formData!: Thesis;
  protected iconIsValid = true;
  private resolve?: (value: 'success' | null) => void;

  async show(thesisSetId: string, thesis: Thesis): Promise<'success' | null> {
    this.thesisSetId = thesisSetId;
    this.thesis = {...thesis};
    this.formData = { ...thesis };
    this.iconIsValid = !!thesis.icon;
    this.open = true;
    this.isLoading = false;

    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private hasChanged(): boolean {
    const keysLengthNotEqual = Object.keys(this.thesis).length !== Object.keys(this.formData).length;
    const valuesIsNotEqual = Object.entries(this.thesis)
      .some(([key, value]) => value !== this.formData[key as keyof Thesis])
    return keysLengthNotEqual || valuesIsNotEqual;
  }

  private saveable(): boolean {
    return this.validateAll() && this.hasChanged();
  }

  private async save() {
    if (!this.saveable()) {
      this.app.error('Необходимо внести изменения или ввести корректные данные.', { errors: this.fieldErrors });
      return;
    }
    this.isLoading = true;

    try {
      const thesisAttrs = { ...this.formData };
      if (!this.iconIsValid) {
        delete thesisAttrs.icon;
      }
      const commandAttrs: EditThesisCommand['attrs'] = {
        id: this.thesisSetId,
        thesis: thesisAttrs
      };
      const updateResult = await this.thesisSetApi.editThesis(commandAttrs);
      
      if (updateResult.isFailure()) {
        this.app.error('Не удалось обновить тезис', {
          attrs: this.formData, 
          result: updateResult.value,
        });
        return;
      }

      if (this.resolve) {
        this.resolve(updateResult.value);
      }
      this.hide();
    } catch (err) {
      this.app.error(`Ошибка при обновлении тезиса`, {
        attrs: this.formData, 
        error: err
      });
    } finally {
      this.isLoading = false;
    }
  }

  private hide() {
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
    this.requestUpdate();
  }

  render() {
    return html`
      <sl-dialog
        label="Редактирование тезиса"
        ?open=${this.open}
        @sl-request-close=${this.hide}
        style="--width: 500px;"
      >
        <div class="editor-container">
          <sl-input
            label="Заголовок карточки"
            help-text="О чем ваш тезис?"
            ?disabled=${this.isLoading}
            .value=${this.formData.title ?? ''}
            @sl-input=${this.createValidateHandler('title')}
          ></sl-input>
          ${this.renderFieldErrors('title')}

          <sl-textarea
            label="Основной текст (Markdown)"
            help-text="Раскройте свой тезис."
            ?disabled=${this.isLoading}
            rows=10
            .value=${this.formData.body ?? ''}
            @sl-input=${this.createValidateHandler('body')}
          ></sl-textarea>
          ${this.renderFieldErrors('body')}

          <sl-input
            label="Футер (необязательно)"
            help-text="При необходимости введите дополнительную информацию."
            ?disabled=${this.isLoading}
            .value=${this.formData.footer || ''}
            @sl-input=${this.createValidateHandler('footer')}
          ></sl-input>
          ${this.renderFieldErrors('footer')}

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

  protected getFieldValue(field: keyof Thesis): unknown {
    return this.formData[field];
  }

  protected setFieldValue(field: keyof Thesis, value: unknown): void {
    this.formData = { ...this.formData, [field]: value };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-thesis-modal': EditThesisModal;
  }
}

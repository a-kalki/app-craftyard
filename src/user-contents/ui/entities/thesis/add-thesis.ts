import { ValidatableElement } from "#app/ui/base/validatable-element";
import type { AddThesisAttrs } from "#user-contents/domain/content/struct/add-content/contract";
import { addThesisContentVmap } from "#user-contents/domain/content/struct/add-content/v-map";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('add-thesis-modal')
export class AddThesisModal extends ValidatableElement<keyof AddThesisAttrs> {
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

    .tab-content {
      min-height: 300px;
      max-height: 60vh;
      overflow-y: auto;
      padding: 1rem;
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
    }

    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;;

  private sectionId!: string;
  protected validatorMap = addThesisContentVmap;

  @state() private isLoading = false;
  @state() private commandBody!: AddThesisAttrs;

  protected iconIsValid: boolean = false;
  private resolve?: (value: string | null) => void;

  async show(sectionId: string): Promise<string | null> {
    this.sectionId = sectionId;
    this.commandBody = {
      sectionId: this.sectionId,
      type: 'THESIS',
      title: '',
      body: '',
      footer: undefined,
      order: undefined,
      icon: undefined,
    }
    this.open = true;
    this.isLoading = false;

    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private async save() {
    if (!this.validateAll()) {
      this.app.error('Необходимо ввести корректные данные.', { errors: this.fieldErrors })
      return;
    }
    this.isLoading = true;

    try {
      const newThesisAttrs = { ...this.commandBody };
      if (!this.iconIsValid) {
        delete newThesisAttrs.icon;
      }

      const addResult = await this.userContentApi.addContent(newThesisAttrs)
      if (addResult.isFailure()) {
        this.app.error('Не удалось добавить данные тезиса', {
           attrs: this.commandBody, result: addResult.value,
        });
        return;
      }
      if (this.resolve) {
        this.resolve(addResult.value.contentId);
      }

      this.hide();
    } catch (err) {
      this.app.error(`[${this.constructor.name}]: Ошибка при добавлении данных тезиса.`, {
        attrs: this.commandBody, error: err
      });
    }
    finally {
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
    this.commandBody.icon = e.detail.name;
    e.preventDefault();
    this.requestUpdate();
  }

  render() {
    return html`
      <sl-dialog
        label="Добавление тезиса"
        ?open=${this.open}
        @sl-request-close=${this.hide}
        style="--width: 500px;"
      >
        <div class="editor-container">
          <sl-input
            label="Заголовок карточки."
            help-text="О чем ваш тезис?"
            .value=${this.commandBody.title ?? ''}
            @sl-input=${this.createValidateHandler('title')}
          ></sl-input>
          ${this.renderFieldErrors('title')}

          <sl-textarea
            label="Основной текст (Markdown)"
            help-text="Раскройте свой тезис."
            rows=10
            .value=${this.commandBody.body ?? ''}
            @sl-input=${this.createValidateHandler('body')}
          ></sl-textarea>
          ${this.renderFieldErrors('body')}

          <sl-input
            label="Футер (необязательно)"
            help-text="При необходимости введите дополнительную информацию."
            .value=${this.commandBody.footer || ''}
            @sl-input=${this.createValidateHandler('footer')}
          ></sl-input>
          ${this.renderFieldErrors('footer')}

          <sl-input
            label="Порядковый номер карточки (необязательно)"
            help-text="Управляйте порядком отображения карточек."
            type="number"
            .value=${this.commandBody.order?.toString() || ''}
            @sl-input=${this.createValidateHandler('order')}
          ></sl-input>
          ${this.renderFieldErrors('order')}

          <icon-picker
            label="Иконка"
            value=${this.commandBody.icon ?? ''}
            ?disabled=${this.isLoading}
            @sl-change=${this.createValidateHandler('icon')}
            @icon-updated=${this.handleIconUpdated}
          ></icon-picker>
          ${this.renderFieldErrors('icon')}
        </div>

        <sl-button slot="footer" @click=${this.hide}>Отмена</sl-button>
        <sl-button 
          slot="footer" 
          variant="primary" 
          ?disabled=${!this.validateAll()}
          @click=${this.save}
        >
          Создать
        </sl-button>
      </sl-dialog>
    `;
  }

  protected getFieldValue(field: keyof AddThesisAttrs): unknown {
    return this.commandBody[field];
  }

  protected setFieldValue(field: keyof AddThesisAttrs, value: unknown): void {
    this.commandBody = { ...this.commandBody, [field]: value };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-thesis-modal': AddThesisModal;
  }
}

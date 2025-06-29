import { ValidatableElement } from "#app/ui/base/validatable-element";
import { addThesisVmap } from "#user-contents/api/use-cases/thesis-set/add-thesis/v-map";
import type { Thesis } from "#user-contents/domain/thesis-set/struct/attrs";
import type { AddThesisCommand } from "#user-contents/domain/thesis-set/struct/thesis/add";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

const defaultTitle = "Начинаем изучать **Markdown**"
const defaultBody = `
**Краткое руководство по markdown:**
- оберните слово в &#42;&#42;двойные-звездочки&#42;&#42; чтобы получить **жирные** слова;
- заканчивайте предложение с двумя пробелами и переводом строки (enter) чтобы следующее предложение начиналось с новой строки (без кавычек)."  ";
- сделайте следующее предложение через одну пустую строку (два раза нажать "enter"), чтобы оно было оформлено как отдельный абзац;
- начните строку с "-" или "1." (можно всегда "1.") чтобы оно было оформлено как список;
    - для многоуровневых списков, начинайте следующий уровень с четырех пробелов;
- [напишите текст внутри квадратных]\(а ссылку внутри круглых\), чтобы получить ссылки на сторонние ресурсы.

**Дополнительно:**
1. этот текст полностью сформирован через markdown;
1. вы можете использовать markdown в заголовке, теле и футере;
1. более подробно, [можно тут](https://skillbox.ru/media/code/yazyk-razmetki-markdown-shpargalka-po-sintaksisu-s-primerami/).
`
const defaultFooter = "Добавьте при желании дополнительную информацию в футер."

type AddThesisAttrs = Omit<Thesis, 'id' | 'createAt' | 'updateAt'>;

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

  @property({ type: String }) thesisSetId = '';
  @property({ type: Boolean, reflect: true }) open = false;;

  protected validatorMap = addThesisVmap;

  @state() private isLoading = false;
  @state() private commandBody!: AddThesisAttrs;

  protected iconIsValid: boolean = false;
  private resolve?: (value: string | null) => void;

  async show(): Promise<string | null> {
    this.commandBody = {
      title: defaultTitle,
      body: defaultBody,
      footer: defaultFooter,
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

      const commandAttrs: AddThesisCommand['attrs'] = {
        id: this.thesisSetId,
        newThesisAttrs
      };
      const addResult = await this.thesisSetApi.addThesis(commandAttrs)
      if (addResult.isFailure()) {
        this.app.error('Не удалось добавить данные тезиса', {
           attrs: this.commandBody, result: addResult.value,
        });
        return;
      }
      if (this.resolve) {
        this.resolve(addResult.value.id);
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

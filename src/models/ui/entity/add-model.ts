import { html, css, type TemplateResult, type CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ValidatableElement } from '#app/ui/base/validatable-element';
import { MODEL_CATEGORY_TITLES, MODEL_CATEGORY_KEYS } from '#models/domain/struct/constants';
import { SKILL_LEVEL_TITLES, SKILL_LEVEL_KEYS } from '#app/core/constants';
import type { AddModelCommand } from '#models/domain/struct/add-model/contract';
import { addModelVmap } from '#models/domain/struct/add-model/v-map';
import type { LiteralDataType, LiteralFieldValidator } from 'rilata/validator';
import { costVmap } from '#app/core/v-map';

type AddModelAttrs = AddModelCommand['attrs'];

@customElement('add-model-modal')
export class AddModelModal extends ValidatableElement<AddModelAttrs> {
  static styles: CSSResultGroup = css`
    sl-dialog::part(panel) {
      width: min(90vw, 800px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    sl-dialog::part(body) {
      flex-grow: 1;
      overflow-y: auto;
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }

    sl-dialog::part(footer) {
      display: flex;
      justify-content: flex-end;
      gap: var(--sl-spacing-medium);
      padding-top: var(--sl-spacing-medium);
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;

  protected validatorMap = addModelVmap;

  @state() protected isLoading = false;
  @state() protected formData!: AddModelCommand['attrs'];

  private resolve?: (result: { modelId: string } | null) => void;

  /** Показывает модальное окно. */
  async show(): Promise<{ modelId: string } | null> {
    this.formData = {
      title: '',
      description: '',
      categories: [],
      difficultyLevel: 'BEGINNER',
      estimatedTime: '',
      cost: { price: 0, currency: 'KZT' },
    };
;
    this.open = true;

    // Добавляем компонент в DOM, если его там нет
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
      const addResult = await this.modelApi.addModel(this.formData);

      if (addResult.isFailure()) {
        this.app.error(`Не удалось добавить модель.`, {
          attrs: this.formData, result: addResult.value,
        });
        return;
      }

      if (this.resolve) {
        this.resolve({ modelId: addResult.value.modelId });
      }
      this.hide();
    } catch (err) {
      this.app.error(`Ошибка при добавлении модели`, {
        attrs: this.formData, error: err
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
    // Удаляем компонент из DOM после закрытия
    if (document.body.contains(this)) {
      document.body.removeChild(this);
    }
  }

  render() {
    return html`
      <sl-dialog
        label="Добавление новой модели"
        ?open=${this.open}
        @sl-request-close=${this.hide}
      >
        <div class="editor-container">
          ${this.renderFields()}
        </div>

        <sl-button slot="footer" @click=${this.hide} ?disabled=${this.isLoading}>Отмена</sl-button>
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

  protected renderFields(): TemplateResult {
    return html`
      <sl-input
        label="Название модели"
        help-text="Краткое и понятное название вашей модели"
        .value=${this.formData.title ?? ''}
        @sl-input=${this.createValidateHandler('title')}
      ></sl-input>
      ${this.renderFieldErrors('title')}

      <sl-textarea
        label="Описание (Markdown)"
        help-text="Подробное описание модели, что она из себя представляет"
        rows=5
        .value=${this.formData.description ?? ''}
        @sl-input=${this.createValidateHandler('description')}
      ></sl-textarea>
      ${this.renderFieldErrors('description')}

      <sl-input
        label="Ориентировочное время изготовления"
        help-text="Например: '2 часа', '1 день', '1 неделя'"
        .value=${this.formData.estimatedTime ?? ''}
        @sl-input=${this.createValidateHandler('estimatedTime')}
      ></sl-input>
      ${this.renderFieldErrors('estimatedTime')}

      <sl-input
        label="Предполагаемая стоимость материалов"
        type="number"
        min="0"
        .value=${this.formData.cost?.price?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('cost')}
      ></sl-input>
      ${this.renderFieldErrors('cost')}

      <sl-select
        label="Категории"
        placeholder="Выберите одну или несколько категорий"
        multiple
        clearable
        .value=${this.formData.categories}
        @sl-change=${this.createValidateHandler('categories')}
      >
        ${MODEL_CATEGORY_KEYS.map(key => html`
          <sl-option value=${key}>${MODEL_CATEGORY_TITLES[key]}</sl-option>
        `)}
      </sl-select>
      ${this.renderFieldErrors('categories')}

      <sl-select
        label="Уровень сложности"
        placeholder="Выберите уровень сложности"
        .value=${this.formData.difficultyLevel ?? ''}
        @sl-change=${this.createValidateHandler('difficultyLevel')}
      >
        ${SKILL_LEVEL_KEYS.map(key => html`
          <sl-option value=${key}>${SKILL_LEVEL_TITLES[key]}</sl-option>
        `)}
      </sl-select>
      ${this.renderFieldErrors('difficultyLevel')}
    `;
  }

  protected getFieldValue(field: keyof AddModelAttrs): unknown {
    if (field === 'cost') return this.formData.cost.price;
    return this.formData[field];
  }

  protected setFieldValue(field: keyof AddModelAttrs, value: unknown): void {
    if (field === 'cost') {
      this.formData = { ...this.formData, cost: { ...this.formData.cost, price: Number(value) } }
      return;
    }
    this.formData = { ...this.formData, [field]: value };
  }

  protected getValidator(
    field: keyof AddModelAttrs
  ): LiteralFieldValidator<string, boolean, boolean, LiteralDataType
  > {
    if (field !== 'cost') return super.getValidator(field);
    return costVmap.price;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-model-modal': AddModelModal;
  }
}

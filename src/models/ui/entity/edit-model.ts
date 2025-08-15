import { ValidatableElement } from '#app/ui/base/validatable-element';
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { MODEL_CATEGORY_KEYS, MODEL_CATEGORY_TITLES } from '#models/domain/struct/constants';
import { SKILL_LEVEL_TITLES } from '#app/core/constants';
import type { EditModelCommand } from '#models/domain/struct/edit-model/contract';
import { editModelVmap } from '#models/domain/struct/edit-model/v-map';
import { costValidator, costVmap } from '#app/core/v-map';

type EditModelAttrs = EditModelCommand['attrs'];

@customElement('edit-model-modal')
export class EditModelModal extends ValidatableElement<EditModelAttrs> {
  @property({ type: Object }) model!: ModelAttrs;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private formData!: EditModelAttrs;
  @state() private isLoading = false;

  private resolve?: (value: { id: string } | null) => void;

  static styles = css`
    sl-dialog::part(panel) {
      width: min(90vw, 800px);
      max-height: 90vh;
    }
    .error {
      color: var(--sl-color-danger-600);
      font-size: 0.875rem;
    }
    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `;

  protected validatorMap = editModelVmap;

  async show(model: ModelAttrs): Promise<{ id: string } | null> {
    this.model = model;
    this.formData = { ...model };
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
    return Object.entries(this.formData)
      .some(([key, value]) => value !== this.model[key as keyof ModelAttrs]);
  }

  private async save() {
    if (!this.validateAll() || !this.hasChanged()) {
      this.app.error('Введите корректные данные или внесите изменения.', { errors: this.fieldErrors });
      return;
    }
    this.isLoading = true;
    try {
      const command: EditModelCommand['attrs'] = {
        id: this.formData.id,
        title: this.formData.title,
        description: this.formData.description,
        categories: this.formData.categories,
        difficultyLevel: this.formData.difficultyLevel,
        estimatedTime: this.formData.estimatedTime,
        cost: this.formData.cost,
      };
      const result = await this.modelApi.editModel(command);
      if (result.isFailure()) {
        this.app.error('Не удалось обновить модель', { result });
        return;
      }
      this.resolve?.({ id: this.formData.id });
      this.hide();
    } catch (error) {
      this.app.error('Ошибка при обновлении модели', { error });
    } finally {
      this.isLoading = false;
    }
  }

  private hide() {
    this.open = false;
    this.resolve?.(null);
    this.resolve = undefined;
    if (document.body.contains(this)) {
      document.body.removeChild(this);
    }
  }

  render() {
    return html`
      <sl-dialog
        label="Редактировать модель"
        ?open=${this.open}
        @sl-request-close=${this.hide}
      >
        <div class="editor-container">
          <sl-input
            label="Название"
            .value=${this.formData.title}
            @sl-input=${this.createValidateHandler('title')}
          ></sl-input>
          ${this.renderFieldErrors('title')}

          <sl-textarea
            label="Описание"
            .value=${this.formData.description}
            @sl-input=${this.createValidateHandler('description')}
          ></sl-textarea>
          ${this.renderFieldErrors('description')}

          <sl-select
            label="Категории"
            .value=${this.formData.categories}
            multiple
            @sl-change=${this.createValidateHandler('categories')}
          >
            ${MODEL_CATEGORY_KEYS.map(cat => html`
              <sl-option value=${cat}>${MODEL_CATEGORY_TITLES[cat]}</sl-option>
            `)}
          </sl-select>
          ${this.renderFieldErrors('categories')}

          <sl-select
            label="Уровень сложности"
            .value=${this.formData.difficultyLevel}
            @sl-change=${this.createValidateHandler('difficultyLevel')}
          >
            ${Object.entries(SKILL_LEVEL_TITLES).map(([key, title]) => html`
              <sl-option value=${key}>${title}</sl-option>
            `)}
          </sl-select>
          ${this.renderFieldErrors('difficultyLevel')}

          <sl-input
            label="Время изготовления"
            .value=${this.formData.estimatedTime}
            @sl-input=${this.createValidateHandler('estimatedTime')}
          ></sl-input>
          ${this.renderFieldErrors('estimatedTime')}

          <sl-input
            label="Цена"
            type="number"
            .value=${this.formData.cost.price.toString()}
            @sl-input=${this.createValidateHandler('cost')}
          ></sl-input>
          ${this.renderFieldErrors('cost')}
        </div>

        <sl-button slot="footer" @click=${this.hide}>Отмена</sl-button>
        <sl-button
          slot="footer"
          variant="primary"
          ?loading=${this.isLoading}
          ?disabled=${!this.hasChanged() || !this.validateAll()}
          @click=${this.save}
        >
          Сохранить
        </sl-button>
      </sl-dialog>
    `;
  }

  protected getFieldValue(field: keyof EditModelAttrs): unknown {
    if (field === 'cost') return this.formData.cost.price;
    return this.formData[field];
  }

  protected setFieldValue(field: keyof EditModelAttrs, value: unknown): void {
    let toSetValue = value;
    if (this.formData[field] !== undefined && toSetValue === undefined) {
      toSetValue = null;
    }
    if (field === 'cost') {
      this.formData.cost.price = Number(toSetValue);
      return
    }
    // @ts-expect-error: ошибка типов будет обработана валидацией
    this.formData[field] = toSetValue;
  }

  protected getValidator(field: keyof EditModelAttrs) {
    if (field === 'cost') return costVmap.price;
    return super.getValidator(field);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-model-modal': EditModelModal;
  }
}

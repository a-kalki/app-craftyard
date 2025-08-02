import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ModelOfferAttrs } from '#offer/domain/base-offer/struct/attrs';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import { BaseOfferCard } from './base-offer-card';

export abstract class ModelOfferCard extends BaseOfferCard {
  @property({ type: Object }) offer!: ModelOfferAttrs;
  @state() private model: ModelAttrs | null = null;
  @state() private isLoadingModel = false;

  static styles = [
    BaseOfferCard.styles,
    css`
      .master-info {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: var(--sl-color-neutral-700);
      }
      .master-info strong {
        color: var(--sl-color-neutral-800);
      }
      .expense-list {
        margin-top: 1rem;
      }
      .expense-list h5 {
        margin-bottom: 0.5rem;
        color: var(--sl-color-neutral-700);
      }
      .expense-list ul {
        list-style: disc;
        padding-left: 1.2rem;
        margin: 0;
      }
      .expense-list li {
        margin-bottom: 0.25rem;
      }
      .expense-list li strong {
        margin-right: 0.3rem;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.loadModel();
  }

  private async loadModel() {
    if (!this.offer || !this.offer.modelId) {
      this.model = null;
      return;
    }
    this.isLoadingModel = true;
    try {
      const result = await this.modelApi.getModel(this.offer.modelId);
      if (result.isFailure()) {
        this.app.error('Не удалось загрузить модель для оффера', { result, modelId: this.offer.modelId });
        this.model = null;
        return;
      }
      this.model = result.value;
    } catch (error) {
      this.app.error('Ошибка при загрузке модели', { modelId: this.offer.modelId, errMsg: (error as Error).message });
      this.model = null;
    } finally {
      this.isLoadingModel = false;
    }
  }

  /**
   * Переопределяем метод получения действий для добавления "Смотреть Модель".
   */
  protected _getActions() {
    const actions = super._getActions(); // Получаем базовые действия (Редактировать, Удалить)

    if (this.model) {
      actions.unshift({
        label: 'Смотреть Модель',
        icon: 'info-circle',
        handler: this.handleGoToModelDetailsClick.bind(this),
        variant: 'primary'
      });
    }
    return actions;
  }

  protected handleGoToModelDetailsClick() {
    if (this.model) {
      this.app.router.navigate(`/offers/${this.offer.id}`);
    } else {
      this.app.error('Модель не загружена, не могу перейти к деталям.');
    }
  }

  protected renderAfterHeader() {
      return html`${this.isLoadingModel
        ? html`<sl-spinner style="font-size: 1.5rem; display: block; margin: 1rem auto;" label="Загрузка модели..."></sl-spinner>`
        : html`<model-summary-card .model=${this.model}></model-summary-card>`
      }`
  }

  protected renderSpecificDetails(): unknown {
    const modelOffer = this.offer as ModelOfferAttrs;

    return html`
      ${modelOffer.estimatedExpenses && modelOffer.estimatedExpenses.length > 0 ? html`
        <div class="expense-list">
          <h5>Предполагаемые расходы:</h5>
          <ul>
            ${modelOffer.estimatedExpenses.map(expense => html`
              <li><strong>${expense.title}:</strong> ${expense.amount} KZT ${expense.description ? `(${expense.description})` : nothing}</li>
            `)}
          </ul>
        </div>
      ` : nothing}

      ${this.renderModelSpecificDetails()}
    `;
  }

  // Этот метод предназначен для переопределения в дочерних классах (CourseOfferCard, etc.)
  protected renderModelSpecificDetails(): unknown {
    return nothing;
  }
}

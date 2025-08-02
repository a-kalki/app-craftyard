import { customElement, state } from 'lit/decorators.js';
import { html, type TemplateResult, css } from 'lit'; // Импортируем css
import { BaseAddOfferModal } from '../base/base-add-offer-modal';
import type { AddHobbyKitOfferAttrs } from '#offer/domain/crud/add-offer/contract';
import { addHobbyKitOfferVmap } from '#offer/domain/crud/add-offer/v-map';
import type { OfferTypes } from '#offer/domain/types';
import type { WorkspaceRentOfferAttrs } from '#offer/domain/workspace-rent/struct/attrs';
import type { ModelAttrs } from '#models/domain/struct/attrs';
import type { Cost } from '#app/core/types';
import { costUtils } from '#app/core/utils/cost/cost-utils';
import { hobbyKitOfferService } from '#offer/domain/hobby-kit/services/hobby-kit-service';

@customElement('add-hobby-kit-offer-modal')
export class AddHobbyKitOfferModal extends BaseAddOfferModal<AddHobbyKitOfferAttrs> {
  static styles = [
    BaseAddOfferModal.styles,
    css`
      .financial-summary {
        border: 1px solid var(--sl-color-neutral-300);
        border-radius: var(--sl-border-radius-medium);
        padding: var(--sl-spacing-medium);
        background-color: var(--sl-color-neutral-50);
        margin-top: var(--sl-spacing-large);
      }

      .financial-summary h4 {
        margin-top: 0;
        margin-bottom: var(--sl-spacing-small);
        color: var(--sl-color-primary-700);
      }

      .financial-summary ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .financial-summary li {
        display: flex;
        justify-content: space-between;
        padding: var(--sl-spacing-2x-small) 0;
        border-bottom: 1px dashed var(--sl-color-neutral-200);
      }

      .financial-summary li:last-child {
        border-bottom: none;
      }

      .financial-summary .label {
        font-weight: var(--sl-font-weight-semibold);
        color: var(--sl-color-neutral-700);
      }

      .financial-summary .value {
        font-weight: var(--sl-font-weight-medium);
        color: var(--sl-color-neutral-900);
      }

      .financial-summary .total-expenses {
        margin-top: var(--sl-spacing-small);
        padding-top: var(--sl-spacing-small);
        border-top: 1px solid var(--sl-color-neutral-300);
        font-size: var(--sl-font-size-large);
      }

      .financial-summary .net-profit {
        margin-top: var(--sl-spacing-medium);
        padding-top: var(--sl-spacing-medium);
        border-top: 2px solid var(--sl-color-primary-200);
        font-size: var(--sl-font-size-x-large);
        font-weight: var(--sl-font-weight-bold);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .net-profit .label {
        color: var(--sl-color-primary-800);
      }

      .net-profit .value {
        font-weight: var(--sl-font-weight-bold);
      }

      .net-profit.positive .value {
        color: var(--sl-color-success-700);
      }

      .net-profit.negative .value {
        color: var(--sl-color-danger-700);
      }

      .net-profit.zero .value {
        color: var(--sl-color-neutral-700);
      }
    `,
  ];

  @state() private workspaceRentOffers: WorkspaceRentOfferAttrs[] = [];

  protected validatorMap = addHobbyKitOfferVmap;

  async show(
    offerType: Exclude<OfferTypes, 'WORKSPACE_RENT_OFFER'>,
    modelAttrs: ModelAttrs,
  ): Promise<{ offerId: string } | null> {
    if (!modelAttrs) {
      this.app.error(
        `[${this.constructor.name}]: Ошибка в приложении. Не передан агрумент модели.`,
      );
      return Promise.resolve(null);
    }
    this.isLoading = true;
    try {
      if (await this.loadWorkspaceRentOffers()) {
        return await super.show(offerType, modelAttrs);
      }
    } catch (error) {
      this.app.error('Непредвиденная ошибка при загрузке данных для модального окна.', { error });
    } finally {
      this.isLoading = false;
    }
    return Promise.resolve(null);
  }

  private async loadWorkspaceRentOffers(): Promise<boolean> {
    try {
      const workshopAttrs = this.app.assertUserWorkshop();
      if (!workshopAttrs) {
        return false;
      }
      const result = await this.offerApi.getWorkshopOffers(workshopAttrs.id);
      if (result.isFailure()) {
        this.app.error(
          'Не удалось загрузить "Офферы абонементов" для мастерской',
          { result: result.value }
        );
        return false;
      }
      this.workspaceRentOffers = result.value
        .filter(offer => offer.type === 'WORKSPACE_RENT_OFFER')
        .filter(offer => offer.mastersDiscount > 0);
      return true;
    } catch (error) {
      this.app.error('Ошибка при загрузке "Офферы абонементов"', { errMsg: (error as Error).message });
      return false;
    }
  }

  protected getModelAttrs(): ModelAttrs | null {
    return this.modelAttrs || null;
  }

  protected getWorkspaceRentOfferAttrs(): WorkspaceRentOfferAttrs | null {
    if (!this.formData.workspaceRentOfferId) {
      return null;
    }
    const rentOffer = this.workspaceRentOffers
      .find(offer => offer.id === this.formData.workspaceRentOfferId);
    if (!rentOffer) return null;
    return rentOffer;
  }

  protected calcTotalExpenses(): Cost | null {
    const modelAttrs = this.getModelAttrs();
    const rentAttrs = this.getWorkspaceRentOfferAttrs();
    if (modelAttrs && rentAttrs)
      return hobbyKitOfferService.calculateTotalExpenses(modelAttrs.cost, rentAttrs)
    return null;
  }

  protected calcNetProfit(): Cost | null {
    const modelAttrs = this.getModelAttrs();
    const rentAttrs = this.getWorkspaceRentOfferAttrs();
    const offerSellingPrice = this.formData.cost;
    if (!modelAttrs || !rentAttrs || !offerSellingPrice) return null;
    return hobbyKitOfferService.calculateNetProfit(
      offerSellingPrice, modelAttrs.cost, rentAttrs
    );
  }

  protected createDefaultOfferAttrs(): Partial<AddHobbyKitOfferAttrs> {
    const workshop = this.app.assertUserWorkshop();
    return {
      title: undefined,
      description: undefined,
      organizationId: workshop!.id,
      offerCooperationId: undefined,
      type: 'HOBBY_KIT_OFFER',
      cost: {
        price: 0,
        currency: 'KZT',
      },
      modelId: this.modelAttrs!.id,
      masterId: this.master!.id,
      workspaceRentOfferId: undefined,
      materialPreparationHours: undefined,
    };
  }

  protected renderSpecificFields(): TemplateResult {
    const totalExpenses = this.calcTotalExpenses();
    const netProfit = this.calcNetProfit();

    let netProfitClass = 'zero';
    if (netProfit && netProfit.price > 0) {
      netProfitClass = 'positive';
    } else if (netProfit && netProfit.price < 0) {
      netProfitClass = 'negative';
    }

    return html`
      <sl-select
        label="Привязанный абонемент"
        help-text="Выберите абонемент, который будет автоматически выдан при покупке набора."
        placeholder="Выберите абонемент"
        clearable
        .value=${this.formData.workspaceRentOfferId ?? ''}
        @sl-change=${this.createValidateHandler('workspaceRentOfferId')}
      >
        ${this.workspaceRentOffers.map(offer => html`
          <sl-option value=${offer.id}>${offer.title}</sl-option>
        `)}
      </sl-select>
      ${this.renderFieldErrors('workspaceRentOfferId')}

      ${totalExpenses ? html`
        <div class="financial-summary">
          <h4>Финансовые детали</h4>
          <ul>
            <li>
              <span class="label">Стоимость модели:</span>
              <span class="value">${costUtils.toString(this.getModelAttrs()?.cost!)}</span>
            </li>
            <li>
              <span class="label">Стоимость абонемента:</span>
              <span class="value">${costUtils.toString(this.getWorkspaceRentOfferAttrs()?.cost!)}</span>
            </li>
            <li class="total-expenses">
              <span class="label">Общие расходы:</span>
              <span class="value">${costUtils.toString(totalExpenses!)}</span>
            </li>
          </ul>
          
          <div class="net-profit ${netProfitClass}">
            <span class="label">Чистая прибыль:</span>
            <span class="value">${netProfit ? costUtils.toString(netProfit) : 'Невозможно посчитать'}</span>
          </div>
          <p class="help-text">Учитывайте расходы на дополнительные материалы, которые не включены в расчет.</p>
        </div>
      `: ''}

      <sl-input
        label="Время подготовки материалов"
        help-text="Примерное время в часах, необходимое для подготовки материалов к набору."
        type="number"
        min="0"
        .value=${this.formData.materialPreparationHours?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('materialPreparationHours')}
      ></sl-input>
      ${this.renderFieldErrors('materialPreparationHours')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-hobby-kit-offer-modal': AddHobbyKitOfferModal;
  }
}

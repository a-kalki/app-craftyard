import { customElement } from 'lit/decorators.js';
import { html, type TemplateResult } from 'lit';
import { BaseAddOfferModal } from '../base/base-add-offer-modal';
import type { AddProductSaleOfferAttrs } from '#offer/domain/crud/add-offer/contract';
import { addProductSaleOfferVmap } from '#offer/domain/crud/add-offer/v-map';

@customElement('add-product-sale-offer-modal')
export class AddProductSaleOfferModal extends BaseAddOfferModal<AddProductSaleOfferAttrs> {
  protected validatorMap = addProductSaleOfferVmap;

  protected createDefaultOfferAttrs(): Partial<AddProductSaleOfferAttrs> {
    const workshop = this.app.assertUserWorkshop();
    if (!workshop || !this.modelAttrs || !this.master) {
      const msg = `[${this.constructor.name}]: Не удалось получить данные мастерской, модели или мастера для инициализации.`
      this.app.error(msg, {
         workshopType: typeof workshop, modelType: typeof this.modelAttrs, masterType: typeof this.master
      });
      throw Error(msg);
    }

    return {
      title: undefined,
      description: undefined,
      offerCooperationId: undefined,
      organizationId: workshop.id,
      type: 'PRODUCT_SALE_OFFER',
      cost: {
        price: 0,
        currency: 'KZT',
      },
      modelId: this.modelAttrs.id,
      masterId: this.master.id,
      productionTimeDays: undefined,
    };
  }

  protected renderSpecificFields(): TemplateResult {
    return html`
      <sl-input
        label="Время производства (дни)"
        help-text="Примерное время в днях, необходимое для изготовления изделия."
        type="number"
        .value=${this.formData.productionTimeDays?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('productionTimeDays')}
      ></sl-input>
      ${this.renderFieldErrors('productionTimeDays')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-product-sale-offer-modal': AddProductSaleOfferModal;
  }
}

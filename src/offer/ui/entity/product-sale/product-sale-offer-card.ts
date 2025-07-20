import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ProductSaleOfferAttrs } from '#offer/domain/product-sale/struct/attrs';
import { ModelOfferCard } from '../base/model-offer-card';

@customElement('product-sale-offer-card')
export class ProductSaleOfferCard extends ModelOfferCard {
  @property({ type: Object }) offer!: ProductSaleOfferAttrs;

  static styles = [
    ModelOfferCard.styles,
    css`
      .product-details {
        margin-top: 1rem;
        font-size: 0.95rem;
        color: var(--sl-color-neutral-700);
      }
      .product-details strong {
        color: var(--sl-color-neutral-800);
      }
    `
  ];

  protected renderModelSpecificDetails(): unknown {
    const productSaleOffer = this.offer as ProductSaleOfferAttrs;
    return html`
      <div class="product-details">
        <div><strong>Срок изготовления:</strong> ${productSaleOffer.productionTimeDays} дней</div>
      </div>
    `;
  }

  // Переопределяем методы для работы с модалками конкретного типа
  protected handleEditClick() {
    this.app.error(`Редактирование предложения о продаже "${this.offer.title}" (ID: ${this.offer.id})`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'product-sale-offer-card': ProductSaleOfferCard;
  }
}

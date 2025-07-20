import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { HobbyKitOfferAttrs } from '#offer/domain/hobby-kit/struct/attrs';
import { ModelOfferCard } from '../base/model-offer-card';

@customElement('hobby-kit-offer-card')
export class HobbyKitOfferCard extends ModelOfferCard {
  @property({ type: Object }) offer!: HobbyKitOfferAttrs;

  static styles = [
    ModelOfferCard.styles,
    css`
      .kit-details {
        margin-top: 1rem;
        font-size: 0.95rem;
        color: var(--sl-color-neutral-700);
      }
      .kit-details strong {
        color: var(--sl-color-neutral-800);
      }
    `
  ];

  protected renderModelSpecificDetails(): unknown {
    const hobbyKitOffer = this.offer as HobbyKitOfferAttrs;
    return html`
      <div class="kit-details">
        <div><strong>Срок подготовки материалов:</strong> ${hobbyKitOffer.materialPreparationHours} ч.</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hobby-kit-offer-card': HobbyKitOfferCard;
  }
}

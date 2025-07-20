import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { OfferAttrs, OfferTypes } from '#offer/domain/types';
import { AssertionException } from 'rilata/core';

@customElement('offer-list-container')
export class OfferListContainer extends BaseElement {
  static styles = css`
    :host {
      display: block;
      padding: 0;
      width: 100%;
      min-width: 0;
    }

    .offer-list-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
      gap: 16px;
      justify-items: center;
      align-items: start;
      min-width: 0;
    }

    .offer-list-grid > * {
      max-width: 100%;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      .offer-list-grid {
        /* На мобильных по-прежнему одна колонка */
        grid-template-columns: 1fr;
      }
    }

    .empty-state {
      text-align: center;
      padding: 30px;
      color: var(--sl-color-neutral-600);
      font-size: 1.1rem;
    }
  `;

  @property({ type: String }) workshopId!: string;
  @property({ type: Boolean }) showAdminInfo: boolean = false;
  @property({ type: Boolean }) canEdit: boolean = false;
  @property({ type: String }) offerType: OfferTypes = 'WORKSPACE_RENT_OFFER';

  @property({ type: Array }) offersData: OfferAttrs[] = [];

  protected handleOfferDeleted(e: CustomEvent<{offerId: string}>): void {
    this.dispatchEvent(new Event('offers-list-changed'));
    e.preventDefault();
  }

  render() {
    const currentTabName = this.getTabDisplayName(this.offerType);

    if (this.offersData.length === 0) {
      return html`
        <div class="empty-state">
          <p>Пока нет предложений в категории "${currentTabName}".</p>
          ${this.canEdit ? html`
            <p>Чтобы добавить новое предложение, нажмите кнопку <sl-icon name="plus-square" style="font-size: 1.2em; vertical-align: middle;"></sl-icon> справа от вкладок.</p>
          ` : nothing}
        </div>
      `;
    }

    return html`
      <div class="offer-list-grid">
        ${this.offersData.map(offer => this.getOfferCard(offer))}
      </div>
      `;
  }

  private getOfferCard(offer: OfferAttrs): TemplateResult {
    if (offer.type === 'WORKSPACE_RENT_OFFER') return html`
      <workspace-rent-offer-card
        .offer=${offer}
        .canEdit=${this.canEdit}
        .showAdminInfo=${this.showAdminInfo}
        @offer-deleted=${this.handleOfferDeleted}
      ></workspace-rent-offer-card>
    `;
    if (offer.type === 'PRODUCT_SALE_OFFER') return html`
      <product-sale-offer-card
        .offer=${offer}
        .canEdit=${this.canEdit}
        .showAdminInfo=${this.showAdminInfo}
        @offer-deleted=${this.handleOfferDeleted}
      ></product-sale-offer-card>
    `;
    if (offer.type === 'HOBBY_KIT_OFFER') return html`
      <hobby-kit-offer-card
        .offer=${offer}
        .canEdit=${this.canEdit}
        .showAdminInfo=${this.showAdminInfo}
        @offer-deleted=${this.handleOfferDeleted}
      ></hobby-kit-offer-card>
    `;
    if (offer.type === 'COURSE_OFFER') return html`
      <course-offer-card
        .offer=${offer}
        .canEdit=${this.canEdit}
        .showAdminInfo=${this.showAdminInfo}
        @offer-deleted=${this.handleOfferDeleted}
      ></course-offer-card>
    `;
    throw new AssertionException(`Передан не валидный тип: ${(offer as any).type}`);
  }

  private getTabDisplayName(type: OfferTypes): string {
    switch (type) {
      case 'WORKSPACE_RENT_OFFER': return 'Взять Абонемент';
      case 'PRODUCT_SALE_OFFER': return 'Купить Изделие';
      case 'HOBBY_KIT_OFFER': return 'Сделать Изделие';
      case 'COURSE_OFFER': return 'Пройти Курсы';
      default: throw new AssertionException(`Передан не валидный тип: ${type}`);
    }
  }
}

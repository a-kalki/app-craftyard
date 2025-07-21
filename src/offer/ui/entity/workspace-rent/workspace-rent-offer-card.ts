import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { WorkspaceRentOfferAttrs } from '#offer/domain/workspace-rent/struct/attrs';
import { BaseOfferCard } from '../base/base-offer-card';
import { WorkshopPolicy } from '#workshop/domain/policy';

@customElement('workspace-rent-offer-card')
export class WorkspaceRentOfferCard extends BaseOfferCard {
  @property({ type: Object }) offer!: WorkspaceRentOfferAttrs;

  static styles = [
    BaseOfferCard.styles,
    css`
      .rent-details {
        margin-top: 0.5rem;
        font-size: 0.95rem;
        color: var(--sl-color-neutral-700);
      }
      .rent-details strong {
        color: var(--sl-color-neutral-800);
      }
    `
  ];

  protected canVisibleDiscount(): boolean {
    const userWorkshop = this.app.userWorkshopInfo;
    if (!userWorkshop.isBind) return false;
    const policy = new WorkshopPolicy(userWorkshop.user, userWorkshop.workshop);
    return policy.isMaster() || policy.isMentor() || policy.isModerator() || policy.isEmpoyee();
  }

  protected renderSpecificDetails(): unknown {
    const workspaceRentOffer = this.offer as WorkspaceRentOfferAttrs;
    const discoutText = workspaceRentOffer.mastersDiscount
      ? `${workspaceRentOffer.mastersDiscount * 100}%`
      : 'не предусмотрено.'
    return html`
      <div class="rent-details">
        <div>
          <strong>Время доступа:</strong> 
          ${workspaceRentOffer.accessHours > 24 
            ? `${(workspaceRentOffer.accessHours / 24).toFixed(1)} дн.` 
            : `${workspaceRentOffer.accessHours} ч.`
          }
        </div><br>
        ${this.canVisibleDiscount() ? html`
          <div><strong>Скидка для hobby-kit:</strong> ${discoutText}</div>
        `: ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'workspace-rent-offer-card': WorkspaceRentOfferCard;
  }
}

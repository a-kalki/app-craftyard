import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import type { UserDod } from '../../app-domain/dod';
import { UserAR } from '../../../users/domain/user/aroot';
import { USER_STATUS_TITLES } from '../../app-domain/constants';

@customElement('user-panel')
export class UserPanelWidget extends BaseElement {
  @property({ type: Boolean }) isMobile = false;
  @property({ type: Object }) user!: UserDod;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--sl-color-neutral-900);
    }

    .info {
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
    }

    .name {
      font-weight: 600;
    }

    .status {
      font-size: 0.75rem;
      color: var(--sl-color-neutral-600);
    }

    .mobile-only {
      display: none;
    }

    @media (max-width: 480px) {
      .desktop-only {
        display: none;
      }
      .mobile-only {
        display: flex;
      }
    }
  `;

  render() {
    const userAr = new UserAR(this.user);
    const statusTitle = USER_STATUS_TITLES[userAr.getMaxPriorityStatus()];

    return html`
      <user-avatar .user=${this.user} shape="circle" size="36"></user-avatar>
      
      <div class="info desktop-only">
        <span class="name">${this.user.name}</span>
        <span class="status">${statusTitle}</span>
      </div>
      
      <div class="mobile-only">
        <sl-button variant="text" @click=${this.app.logout}>
          <sl-icon name="box-arrow-right"></sl-icon>
        </sl-button>
      </div>
      
      <sl-divider vertical class="desktop-only"></sl-divider>
      <sl-button variant="text" class="desktop-only" @click=${this.app.logout}>
        <sl-icon name="box-arrow-right"></sl-icon>
      </sl-button>
    `;
  }
}

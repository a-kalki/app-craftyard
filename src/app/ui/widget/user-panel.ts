import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import type { UserDod } from '../../app-domain/dod';

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

    .role {
      font-size: 0.75rem;
      color: var(--sl-color-neutral-600);
    }
  `;

  render() {
    const { name, roleCounters: roles, profile } = this.user;

    return html`
      <user-avatar .user=${this.user} shape="circle"></user-avatar>
      ${!this.isMobile
        ? html`
            <div class="info">
              <span class="name">${name}</span>
              <span class="role">${roles[0]}</span>
            </div>
          `
        : null}
        <sl-divider></sl-divider>
        <sl-button variant="text" @click=${this.app.logout}>
          <sl-icon name="box-arrow-right"></sl-icon>
        </sl-button>
    `;
  }
}

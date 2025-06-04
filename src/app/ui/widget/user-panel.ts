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

    .avatar {
      border-radius: 50%;
      width: 32px;
      height: 32px;
      object-fit: cover;
      box-shadow: var(--sl-shadow-small);
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
    const { name, roles, profile } = this.user;
    const avatarUrl = profile?.avatarUrl || `/assets/app/${roles[0].toLowerCase() ?? 'hobbist'}.png'}`;

    return html`
      <img class="avatar" src=${avatarUrl} alt="avatar" />
      ${!this.isMobile
        ? html`
            <div class="info">
              <span class="name">${name}</span>
              <span class="role">${roles[0]}</span>
            </div>
          `
        : null}
    `;
  }
}

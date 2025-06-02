import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { WithContextElement } from '../base/base-element';
import type { UserUI } from '../base/types';

@customElement('user-panel')
export class UserPanelWidget extends WithContextElement {
  @property({ type: Boolean }) isMobile = false;
  @property({ type: Object }) user!: UserUI;

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
    }

    .avatar {
      background: white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      object-fit: cover;
    }

    .info {
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
    }

    .name {
      font-weight: bold;
    }

    .role {
      font-size: 0.75rem;
      color: #ccc;
    }
  `;

  render() {
    const { name, roles, profile } = this.user;
    const avatarUrl = profile?.avatarUrl || `assets/app/${roles[0].toLowerCase() ?? 'hobbist'}.png'}`;

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

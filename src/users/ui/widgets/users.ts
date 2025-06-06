import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserDod } from '../../../app/app-domain/dod';
import { usersApi } from '../users-api';

@customElement('users-list')
export class UsersWidget extends BaseElement {
  static routingAttrs = {
    pattern: '/users',
    tag: 'users-list',
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  @state()
  private users: UserDod[] = [];

  async connectedCallback() {
    super.connectedCallback();
    const result = await usersApi.getUsers();
    this.users = result.status ? result.success : [];
  }

  render() {
    return html`
      <div class="grid">
        ${this.users.map(
          (user) => html`
            <user-card
              .user=${user}
            ></user-card>
          `
        )}
      </div>
    `;
  }
}

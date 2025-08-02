import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserAttrs } from '#users/domain/user/struct/attrs';

@customElement('users-list')
export class UsersWidget extends BaseElement {

  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow-y: auto;
      padding: 16px;
      box-sizing: border-box;
    }

    .users-list-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .grid {
      display: grid;
      gap: 16px;
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    @media (max-width: 768px) {
      :host {
        padding-top: 32px;
        box-sizing: border-box;
      }
    }

    @media (max-width: 600px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }

    @media (min-width: 601px) and (max-width: 991px) {
      .grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }
    }

    @media (min-width: 992px) and (max-width: 1200px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    user-card {
      width: 100%;
      min-width: 0;
    }
  `;

  @state()
  private users: UserAttrs[] = [];

  async connectedCallback() {
    super.connectedCallback();
    const result = await this.userApi.getUsers();
    if (result.isFailure()) {
      this.app.error('Не удалось отобразить страницу, попробуйте позже.', { details: { result: result.value } });
      return;
    }
    this.users = result.value;
  }

  render() {
    return html`
      <div class="users-list-wrapper">
        <div class="grid">
          ${this.users.map(user => html`<user-card .user=${user}></user-card>`)}
        </div>
      </div>
    `;
  }
}

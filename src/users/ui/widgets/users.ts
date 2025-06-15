import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import { usersApi } from '../users-api';
import type { UserAttrs } from '#app/domain/user/struct/attrs';

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
      box-sizing: border-box;
      width: 100%;
      max-width: 1200px; /* Ограничение по макету */
      margin: 0 auto; /* Центрирование */
    }

    .grid {
      display: grid;
      gap: 16px;
      width: 100%;
      
      /* Автоматическая адаптация с приоритетом на 3 колонки */
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    /* Точные контрольные точки для 3 колонок */
    @media (min-width: 1150px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    /* На промежуточных размерах - 2 колонки */
    @media (min-width: 900px) and (max-width: 899px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    /* На узких экранах - 1 колонка */
    @media (max-width: 650px) {
      .grid {
        grid-template-columns: 1fr;
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
    const result = await usersApi.getUsers();
    if (result.isFailure()) {
      this.app.error('Не удалось отобразить страницу, попробуйте позже.', { details: { result: result.value } });
      return;
    }
    this.users = result.value;
  }

  render() {
    return html`
      <div class="grid">
        ${this.users.map(user => html`<user-card .user=${user}></user-card>`)}
      </div>
    `;
  }
}

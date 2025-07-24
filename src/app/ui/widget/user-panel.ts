import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import { UserAr } from '#app/domain/user/a-root';
import { USER_CONTRIBUTIONS_DETAILS } from '#app/domain/user-contributions/constants';
import type { UserAttrs } from '#app/domain/user/struct/attrs';

@customElement('user-panel')
export class UserPanelWidget extends BaseElement {
  @property({ type: Boolean }) isMobile = false;
  @property({ type: Object }) user: UserAttrs | null = null;

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

    .title {
      font-size: 0.75rem;
      color: var(--sl-color-neutral-600);
    }
  `;

  render() {
    if (!this.user) {
      return html`
        <sl-tooltip content="Войти" placement="left">
          <sl-button
            variant="text"
            size="large"
            @click=${() => this.app.showLogin(this.app.router.getPath())}
          >
            <sl-icon slot="prefix" label="Войти" name="box-arrow-in-right"></sl-icon>
          </sl-button>
        </sl-tooltip>
      `;
    }

    const isTelegramApp = this.app.appState.isTelegramMiniApp;

    const userAr = new UserAr(this.user);
    const topKey = userAr.getTopContributionKeyByOrder();
    const title = USER_CONTRIBUTIONS_DETAILS[topKey].title;

    return html`
      <user-avatar .user=${this.user} shape="circle" size="36"></user-avatar>
      
      <div class="info">
        <span class="name">${this.user.name}</span>
        <span class="title">${title}</span>
      </div>
      
      ${!isTelegramApp ? html`
        <sl-tooltip content="Выйти" placement="left">
          <sl-button
            variant="text"
            size="large"
            @click=${() => this.app.logout()}
          >
            <sl-icon name="box-arrow-right"></sl-icon>
          </sl-button>
        </sl-tooltip>
      `: ''}
    `;
  }
}

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './user-panel';
import { BaseElement } from '../base/base-element';

@customElement('app-header')
export class AppHeaderWidget extends BaseElement {
  @property({ type: Boolean }) isMobile = false;

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--sl-color-neutral-100);
      color: var(--sl-color-neutral-900);
      padding: 0 1rem;
      box-shadow: var(--sl-shadow-large);
      box-sizing: border-box;
    }

    .container {
      margin: 0 auto;
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-button {
      margin-right: 0.5rem;
    }

    .menu-button sl-icon {
      font-size: 1.5rem;
      color: var(--sl-color-primary-600);
    }

    img {
      height: 32px;
    }

    .right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `;

  render() {
    const userInfo = this.app.userInfo;
    const user = userInfo.isAuth ? userInfo.user : null;

    return html`
      <div class="container">
        <div class="left">
          ${this.isMobile
            ? html`
                <sl-button
                  variant="text"
                  class="menu-button"
                  @click=${() =>
                    this.dispatchEvent(new CustomEvent('toggle-sidebar', {
                      bubbles: true,
                      composed: true
                    }))}
                >
                  <sl-icon name="list"></sl-icon>
                </sl-button>
              `
            : null}
          <img
            src="/assets/app/logo_full.svg"
            alt="logo"
          />
        </div>
        <div class="right">
          <user-panel .isMobile=${this.isMobile} .user=${user}></user-panel>
        </div>
      </div>
    `;
  }
}

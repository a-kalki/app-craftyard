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
      left: 50%;
      transform: translateX(-50%);
      height: 56px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--sl-color-neutral-100);
      color: var(--sl-color-neutral-900);
      padding: 0 1rem;
      box-shadow: var(--sl-shadow-large);

      width: 100%;
      max-width: 1200px; /* такое же ограничение, как у контейнера приложения */
      box-sizing: border-box;
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
    const user = this.app.getState().currentUser;
    return html`
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
          src=${this.isMobile
            ? '/assets/app/logo_short.svg'
            : '/assets/app/logo_full.svg'}
          alt="logo"
        />
      </div>
      <div class="right">
        <user-panel .isMobile=${this.isMobile} .user=${user}></user-panel>
      </div>
    `;
  }
}

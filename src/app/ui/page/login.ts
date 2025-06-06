import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { TelegramAuthUser, UserApiInterface } from '../base-run/run-types';
import { AppNotifier } from '../base/app-notifier';

@customElement('login-page')
export class LoginPage extends LitElement {
  createRenderRoot() {
    return this; // Light DOM нужен для Telegram-виджета
  }

  @property({ type: Boolean }) debug = true;
  @property({ type: Object }) usersApi!: UserApiInterface;
  @state() private widgetLoaded = false;

  private appNotifier = new AppNotifier();

  connectedCallback(): void {
    super.connectedCallback();
    window.onTelegramAuth = this.onTelegramAuth.bind(this);
  }

  firstUpdated() {
    this.renderTelegramWidget();
  }

  private renderStyles() {
    return html`
      <style>
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding: 32px;
          border-radius: var(--sl-border-radius-large);
          box-shadow: var(--sl-shadow-large);
          background-color: var(--sl-color-neutral-0);
          width: 100%;
          max-width: 400px;
          box-sizing: border-box;
        }

        h2 {
          font-size: 1.5rem;
          margin: 0;
          text-align: center;
        }

        #telegram-container {
          min-height: 48px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .debug-button-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 20px;
            gap: 16px;
          }

          h2 {
            font-size: 1.3rem;
          }
        }
      </style>
    `;
  }

  private renderTelegramWidget() {
    const container = this.querySelector('#telegram-container');
    if (!container || this.widgetLoaded) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.dataset.telegramLogin = 'dedok_app_bot';
    script.dataset.size = 'large';
    script.dataset.userpic = 'true';
    script.dataset.requestAccess = 'write';
    script.dataset.onauth = 'onTelegramAuth(user)';
    script.dataset.authUrl = 'https://c78f-2a0d-b201-6010-f27f-391-ab73-6d33-14b8.ngrok-free.app/';

    script.onload = () => {
      this.widgetLoaded = true;
      this.requestUpdate();
    };

    container.appendChild(script);
  }

  private async onTelegramAuth(tgUser: TelegramAuthUser) {
    const result = await this.usersApi.findUser(tgUser.id.toString());
    if (!result.status) {
      alert('Вы не зарегистрированы. Пройдите регистрацию.');
      window.dispatchEvent(new CustomEvent('need-registration', { detail: tgUser }));
      return;
    }
    this.appNotifier.info('user-logined', { details: result.success });
    window.dispatchEvent(new CustomEvent('user-logined', { detail: result.success }));
  }

  render() {
    return html`
      ${this.renderStyles()}

      <div class="login-container">
        <h2>Вход через Telegram</h2>

        <div id="telegram-container">
          ${this.widgetLoaded
            ? null
            : html`<sl-spinner style="font-size: 24px;"></sl-spinner>`}
        </div>

        ${this.debug ? html`
          <div class="debug-button-wrapper">
            <sl-button variant="primary" @click=${() =>
              this.onTelegramAuth({
                id: 1,
                first_name: 'Нурболат',
                username: 'anzUralsk',
                auth_date: Date.now(),
                hash: 'debug'
              })}>
              Debug вход
            </sl-button>
          </div>
        ` : null}
      </div>
    `;
  }
}

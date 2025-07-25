import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { BootstrapResolves, TelegramWidgetUserData } from '../base-run/run-types';
import { AppNotifier } from '../base/app-notifier';
import type { AuthData, AuthUserSuccess } from '#users/domain/user/struct/auth-user/contract';
import type { UiUserFacade } from '#users/domain/user/facade';

@customElement('login-page')
export class LoginPage extends LitElement {
  createRenderRoot() {
    return this; // Light DOM нужен для Telegram-виджета
  }

  @property({ type: Boolean }) debug = true;
  @state() private widgetLoaded = false;

  private appNotifier = new AppNotifier();

  protected get userFacade(): UiUserFacade {
    return (window as any).userApi;
  }

  protected get resolves(): BootstrapResolves {
    return (window as any).app.resolves; // надо ли resolves делать глобальным?
  }

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

    script.onload = () => {
      this.widgetLoaded = true;
      this.requestUpdate();
    };

    container.appendChild(script);
  }

  private async onTelegramAuth(tgUser: TelegramWidgetUserData) {
    const data: AuthData = {
      type: 'widget-login',
      data: new URLSearchParams(tgUser as Record<string, string>).toString(),
    }
    const result = await this.userFacade.authUser(data);
    if (result.isFailure()) {
      const msg = 'В процессе авторизации произошел сбой, попробуйте перезагрузить страницу.';
      if (this.appNotifier) {
        this.appNotifier.error(msg, { details: result.value });
      }
      return;
    }
    window.dispatchEvent(new CustomEvent<AuthUserSuccess>('user-logined', { detail: result.value }));
  }

  private getDebugAuthUser(): TelegramWidgetUserData | undefined {
    return this.resolves.debugUserMode.isDebugMode
      ?this.resolves.debugUserMode.user
      : undefined;
  }

  render() {
    const debugAuthUser = this.getDebugAuthUser();
    return html`
      ${this.renderStyles()}

      <div class="login-container">
        <h2>Вход через Telegram</h2>

        <div id="telegram-container">
          ${this.widgetLoaded
            ? null
            : html`<sl-spinner style="font-size: 24px;"></sl-spinner>`}
        </div>

        ${debugAuthUser ? html`
          <div class="debug-button-wrapper">
            <sl-button variant="primary" @click=${() =>
              this.onTelegramAuth(debugAuthUser)}>
              Debug вход
            </sl-button>
          </div>
        ` : null}
      </div>
    `;
  }
}

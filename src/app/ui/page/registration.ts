import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { UserApiInterface } from '../base-run/run-types';
import { AppNotifier } from '../base/app-notifier';

@customElement('registration-page')
export class RegistrationPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }

    .form {
      max-width: 400px;
      margin: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    img.avatar {
      width: 98px;
      height: 98px;
      border-radius: var{(--sl-border-radius-medium)};
    }
  `;

  @property({ type: String }) telegramId!: string;
  @property({ type: String }) telegramName!: string;
  @property({ type: String }) telegramNickname?: string;
  @property({ type: String }) avatarUrl?: string;

  @property({ type: Object }) usersApi!: UserApiInterface;

  @state() private submitting = false;

  private appNotifier = new AppNotifier();

  private async handleRegister() {
    this.submitting = true;
    this.checkValidity();

    try {
      const registerResult = await this.usersApi.registerUser({
        id: this.telegramId,
        name: this.telegramName,
        telegramNickname: this.telegramNickname,
        avatarUrl: this.avatarUrl,
      });
      const result = await this.usersApi.findUser(this.telegramId);

      if(!result.status || !registerResult.status) {
        this.appNotifier.error('Извините, но что то пошло не так! Попробуйте перегрузить страницу!', {
          description: 'Ошибка. Пользователь не был зарегистрирован в системе.',
          result
        });
        return;
      }

      window.dispatchEvent(new CustomEvent('user-logined', { detail: result.success }))

    } catch (e) {
        this.appNotifier.error('Ошибка регистрации. Попробуйте позже.', {
          description: 'В процессе регистрации произошла непредвиденная ошибка.',
          error: e
        });
      console.error(e);
    } finally {
      this.submitting = false;
    }
  }

  private checkValidity(): boolean {
    const inputs: NodeListOf<HTMLInputElement | HTMLTextAreaElement> =
      this.renderRoot.querySelectorAll('sl-input, sl-textarea');

    let allValid = true;
    for (const input of Array.from(inputs)) {
      if ('reportValidity' in input && !input.reportValidity()) {
        allValid = false;
      }
    }

    if (!allValid) {
      this.appNotifier.info('Заполните все обязательные поля', { variant: 'warning' });
      return false;
    }
    return true;
  }

  render() {
    return html`
      <div class="form">

        <sl-input label="Telegram ID" required .value=${this.telegramId} disabled></sl-input>

        <sl-input
          label="Имя"
          required
          help-text="Как к тебе обращаться?"
          .value=${this.telegramName}
          @sl-input=${(e: CustomEvent) => {
            this.telegramName = (e.target as HTMLInputElement).value;
          }}
        ></sl-input>

        ${!this.telegramNickname ? html`
          <sl-input
            label="Никнейм Telegram"
            disabled
            help-text="Никнейм не указан. Если это сделать (позже), то к вам могут обращаться напрямую"
            .value=
          ></sl-input>
        `: ''}

        <div class="avatar-row">
          <div class="avatar-input">
            <sl-input
              label="Аватар URL"
              help-text="Укажи свой аватар (ссылку)!"
              style="height: 100%;"
              .value=${this.avatarUrl}
              @sl-input=${(e: CustomEvent) => this.avatarUrl = (e.target as HTMLInputElement).value}
            ></sl-input>
          </div>

          ${this.avatarUrl && this.avatarUrl.startsWith('http') ? html`
            <img class="avatar" src=${this.avatarUrl} />
          ` : ''}
        </div>

        <sl-button
          variant="primary"
          @click=${this.handleRegister}
          ?disabled=${this.submitting}
        >
          Зарегистрироваться
        </sl-button>
      </div>
    `;
  }
}


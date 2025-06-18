import { BaseElement } from "#app/ui/base/base-element";
import type { IndividualCommission } from "#workshop/domain/struct/attrs";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { UserAttrs } from "#app/domain/user/struct/attrs";

@customElement('workshop-individual-commission-card')
export class WorkshopIndividualCommissionCard extends BaseElement {
  static styles = css`
    .individual-card {
      padding: 0; /* sl-details handles padding */
      background: var(--sl-color-neutral-100);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-extra-small); /* Lighter shadow for individual cards */
      border: 1px solid var(--sl-color-neutral-200);
    }

    .individual-card sl-details::part(header) {
      background-color: var(--sl-color-neutral-200);
      padding: 0.75rem 1rem;
      font-weight: 600;
      font-size: 1rem;
      color: var(--sl-color-primary-800);
      border-radius: var(--sl-border-radius-medium) var(--sl-border-radius-medium) 0 0;
    }

    .individual-card sl-details[open]::part(header) {
        border-bottom: 1px solid var(--sl-color-neutral-300);
    }

    .individual-card sl-details::part(content) {
        padding: 1rem;
        background-color: var(--sl-color-neutral-0);
        border-radius: 0 0 var(--sl-border-radius-medium) var(--sl-border-radius-medium);
    }

    .commission-values {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .commission-value {
      display: flex;
      flex-direction: column;
    }

    .commission-label {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
    }

    .commission-percent {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--sl-color-primary-800);
    }

    .individual-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        flex-wrap: wrap;
    }

    .individual-info .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        background-color: var(--sl-color-primary-200);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--sl-color-primary-800);
        font-weight: bold;
        font-size: 0.9rem;
    }

    .individual-user-name {
        font-weight: 600;
        color: var(--sl-color-neutral-900);
        font-size: 1.05rem;
    }

    .individual-telegram {
        font-size: 0.9rem;
        color: var(--sl-color-primary-700);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .individual-telegram:hover {
        text-decoration: underline;
    }

    .individual-reason {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-700);
      margin-top: 0.5rem;
    }

    .individual-valid {
      font-size: 0.85rem;
      color: var(--sl-color-neutral-600);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .individual-valid sl-icon {
        font-size: 0.9rem;
        color: var(--sl-color-neutral-500);
    }
  `;

  @property({ type: Object })
  commission?: IndividualCommission;

  @state()
  private user?: UserAttrs;

  @state()
  private isLoadingUser: boolean = true;

  async connectedCallback() {
    super.connectedCallback();
    if (this.commission?.userId) {
      try {
        this.isLoadingUser = true;
        const getResult = await this.usersFacade.getUser(this.commission.userId);
        if (getResult.isFailure()) {
          this.app.info('Не удалось загрузить пользователя', { details: getResult.value });
          return;
        }
        this.user = getResult.value;
      } catch (error) {
          this.app.info('Не удалось загрузить пользователя', { details: { error } });
          this.user = undefined;
      } finally {
        this.isLoadingUser = false;
      }
    } else {
        this.isLoadingUser = false;
    }
  }

  render() {
    if (!this.commission) return html``;

    const summaryText = this.user && !this.isLoadingUser
      ? `Комиссия для ${this.user.name || this.commission.userId}`
      : `Комиссия для пользователя ID: ${this.commission.userId}`;

    return html`
      <div class="individual-card">
        <sl-details summary=${summaryText}>
          ${this.isLoadingUser ? html`
            <sl-spinner style="font-size: 20px;"></sl-spinner> Загрузка пользователя...
          ` : this.user ? html`
            <div class="individual-info">
                ${this.user.profile.avatarUrl ? html`
                    <img src=${this.user.profile.avatarUrl} alt="Аватар ${this.user.name}" class="avatar">
                ` : html`
                    <div class="avatar">${this.user.name ? this.user.name.charAt(0).toUpperCase() : this.user.id.charAt(0).toUpperCase()}</div>
                `}
                <span class="individual-user-name">${this.user.name || `Пользователь ${this.user.id}`}</span>
                ${this.user.profile.telegramNickname ? html`
                    <a href="https://t.me/${this.user.profile.telegramNickname.replace('@', '')}" target="_blank" rel="noopener noreferrer" class="individual-telegram">
                        <sl-icon name="send"></sl-icon> ${this.user.profile.telegramNickname}
                    </a>
                ` : ''}
            </div>
          ` : html`
            <div class="individual-info">
              <sl-icon name="person-slash"></sl-icon>
              <span>Пользователь не найден</span>
            </div>
          `}

          <div class="commission-values">
            ${this.commission.productCommissionPercent ? html`
              <div class="commission-value">
                <span class="commission-label">Изделия</span>
                <span class="commission-percent">${this.commission.productCommissionPercent}%</span>
              </div>
            ` : ''}
            ${this.commission.programCommissionPercent ? html`
              <div class="commission-value">
                <span class="commission-label">Мастер-классы</span>
                <span class="commission-percent">${this.commission.programCommissionPercent}%</span>
              </div>
            ` : ''}
          </div>

          <p class="individual-reason">Причина: ${this.commission.reason}</p>
          <p class="individual-valid">
            <sl-icon name="calendar"></sl-icon>
            Действует до: ${new Date(this.commission.validUntil).toLocaleDateString()}
          </p>
        </sl-details>
      </div>
    `;
  }
}

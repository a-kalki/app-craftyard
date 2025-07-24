import { html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '#app/ui/base/base-element';
import type { UserAttrs } from '#app/domain/user/struct/attrs';
import { USER_CONTRIBUTIONS_DETAILS } from '#app/domain/user-contributions/constants';
import type { UserContributionKey } from '#app/domain/user-contributions/types';
import type { ThesisContent } from '#user-contents/domain/content/struct/thesis-attrs';

@customElement('user-info-section')
export class UserInfoCard extends BaseElement {
  static styles = css`
    :host {
      display: block;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32px;
      margin-bottom: 24px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--sl-color-neutral-800);
      margin: 0;
    }

    .master-card {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
    }
    .master-avatar sl-avatar {
      --size: 80px;
    }
    .master-info {
      flex-grow: 1;
    }
    .master-info h3 {
      font-size: 1.4rem;
      margin: 0 0 5px 0;
      color: var(--sl-color-primary-700);
    }
    .master-info p {
      margin: 0 0 5px 0;
      color: var(--sl-color-neutral-700);
    }
    .master-skills-section,
    .master-contributions-section {
      margin-top: 15px;
    }
    .master-skills-section h4,
    .master-contributions-section h4 {
      font-size: 1.1rem;
      margin-bottom: 10px;
      color: var(--sl-color-neutral-800);
    }
    .master-skills sl-tag,
    .master-contributions sl-tag {
      margin-right: 5px;
      margin-bottom: 5px;
      display: inline-flex;
      align-items: center;
    }

    /* Styles for sl-button-group to ensure consistent sizing */
    sl-button-group sl-button,
    sl-button-group sl-dropdown::part(trigger) {
      --button-size: 36px;
      height: var(--button-size);
      min-width: var(--button-size);
      min-height: var(--button-size);
      padding: 0; /* Remove default padding as icon fills */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    sl-button-group sl-button sl-icon,
    sl-button-group sl-dropdown::part(trigger) sl-icon {
      font-size: 1.2em;
    }

    /* Override Shoelace's default for dropdown trigger in a group */
    sl-button-group sl-dropdown::part(trigger) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
  `;

  @property({ type: Object })
  user!: UserAttrs; // Пользователь, информация о котором будет отображаться

  @property({ type: String })
  title: string = 'О пользователе'; // Заголовок секции

  /**
   * Определяет, должны ли отображаться кнопки действий для пользователя.
   * По умолчанию true, для мастера обычно true, для конструктора может быть false.
   */
  @property({ type: Boolean })
  showActions: boolean = true;

  @state() skillContents: ThesisContent[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this.loadSkills();
  }

  protected async loadSkills(): Promise<void> {
    const result = await this.userContentApi.getSectionContens(this.user.profile.skillsContentSectionId);
    if (result.isFailure()) {
      this.app.error(
        `[${this.constructor.name}]: Не удалось загрузить навыки пользователя`,
        { details: result.value }
      )
      return;
    }
    this.skillContents = result.value.filter(c => c.type === 'THESIS');
  }

  protected render(): TemplateResult {
    if (!this.user) {
      return html`<h2>Пользователь не найден!</h2>`;
    }

    const telegramHref = this.user.profile.telegramNickname ? `https://t.me/${this.user.profile.telegramNickname}` : null;
    const profileHref = `/users/${this.user.id}`;

    const userContributions = this.user.statistics.contributions;
    const userContributionKeys = Object.keys(userContributions);

    return html`
      <div class="section-header">
        <h2 class="section-title">${this.title}</h2>
        ${this.showActions ? html`
          <sl-button-group>
            ${telegramHref ? html`
              <sl-tooltip content="Написать в Telegram" placement="left">
                <sl-button
                  size="small"
                  variant="primary"
                  href=${telegramHref}
                  target="_blank"
                  rel="noopener"
                >
                  <sl-icon name="telegram"></sl-icon>
                </sl-button>
              </sl-tooltip>
            ` : nothing}

            <sl-dropdown placement="bottom-end" hoist>
              <sl-button size="small" slot="trigger" variant="primary" caret> </sl-button>
              <sl-menu>
                ${telegramHref ? html`
                  <sl-menu-item
                    href=${telegramHref}
                    target="_blank"
                    rel="noopener"
                  >
                    <sl-icon slot="prefix" name="telegram"></sl-icon>
                    Написать в Telegram
                  </sl-menu-item>
                ` : nothing}
                ${profileHref ? html`
                  <sl-menu-item
                    @click=${() => this.app.router.navigate(profileHref)}
                  >
                    <sl-icon slot="prefix" name="info-circle"></sl-icon>
                    Профиль пользователя
                  </sl-menu-item>
                ` : nothing}
              </sl-menu>
            </sl-dropdown>
          </sl-button-group>
        ` : nothing}
      </div>
      <div class="master-card">
        ${this.user.profile.avatarUrl ? html`
          <div class="master-avatar">
            <sl-avatar image=${this.user.profile.avatarUrl} label=${this.user.name}></sl-avatar>
          </div>
        ` : nothing}
        <div class="master-info">
          <h3>${this.user.name}</h3>
          ${this.skillContents.length ? html`
            <div class="master-skills-section">
              <h4>Навыки:</h4>
              ${this.skillContents.map(content => (
                html`<user-skill-tag .content=${content}></user-skill-tag>`
              ))}
            </div>
          ` : nothing}
          ${userContributionKeys.length ? html`
            <div class="master-contributions-section">
              <h4>Вклад в сообщество:</h4>
              <div>
                ${userContributionKeys.sort((a, b) => {
                  const orderA = USER_CONTRIBUTIONS_DETAILS[a as UserContributionKey]?.orderNumber || 999;
                  const orderB = USER_CONTRIBUTIONS_DETAILS[b as UserContributionKey]?.orderNumber || 999;
                  return orderA - orderB;
                }).map((key) => html`
                  <user-contribution-tag
                    .key=${key as UserContributionKey}
                    .counter=${userContributions[key as keyof typeof userContributions]!}
                  ></user-contribution-tag>
                `)}
              </div>
            </div>
          ` : nothing}
        </div>
      </div>
      <hr>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-info-section': UserInfoCard;
  }
}

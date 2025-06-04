import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserDod } from '../../../app/app-domain/dod';
import { USER_ROLE_TITLES, USER_ROLE_ICONS } from '../../../app/app-domain/constants';
import { usersApi } from '../users-api';

@customElement('user-details')
export class UserDetailsEntity extends BaseElement {
  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 8px;
      padding: 16px;
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-large);
      font-family: var(--sl-font-sans);
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--sl-color-primary-600);
    }

    .name {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--sl-color-primary-900);
    }

    .roles {
      display: flex;
      gap: 0.5rem;
      margin-top: 4px;
      flex-wrap: wrap;
    }

    .skills-list {
      margin-top: 1rem;
    }

    .skill-item {
      margin-bottom: 0.75rem;
    }

    .skill-name {
      font-weight: 600;
      color: var(--sl-color-primary-700);
    }

    .skill-desc {
      margin-left: 1rem;
      color: var(--sl-color-neutral-700);
      font-size: 0.9rem;
    }

    sl-divider {
      margin: 1rem 0;
    }

    .joined-date {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
      margin-top: 0.5rem;
    }
  `;

  static routingAttrs = {
    pattern: '/users/:userId',
    tag: 'user-details',
  };

  @state()
  private user: UserDod | null = null;

  async connectedCallback() {
    super.connectedCallback();
    const userId = this.getUserId();
    const user = await this.loadUser(userId);
    if (!user) {
      this.app.error('Не удалось загрузать данные пользователя', {
        userId,
        description: 'Пользователя с таким id не существует в сервисе'
      });
      return;
    }
    this.user = user;
  }

  protected getUserId(): string {
    return this.app.router.getParams().userId;
  }

  private async loadUser(userId: string): Promise<UserDod | undefined> {
    return usersApi.findUser(userId);
  }

  private formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  render() {
    if (!this.user) return html`<sl-spinner label="Загрузка пользователя..." style="width:48px; height:48px;"></sl-spinner>`;

    const { profile, roles, joinedAt } = this.user;
    const skillsEntries = Object.entries(profile.skills ?? {});

    return html`
      <div class="header">
        <img class="avatar" src=${profile.avatarUrl} alt="Аватар пользователя" />
        <div>
          <div class="name">${this.user.name}</div>
          <div class="roles">
            ${roles.map(role => html`
              <sl-tag
                size="small"
                variant="primary"
                pill
                >${USER_ROLE_TITLES[role] ?? role}</sl-tag
              >
            `)}
          </div>
          <div class="joined-date">Присоединился: ${this.formatDate(joinedAt)}</div>
        </div>
      </div>

      <sl-divider></sl-divider>

      <section class="skills-list">
        <h3>Навыки и специализации</h3>
        ${skillsEntries.length === 0
          ? html`<p>Навыки отсутствуют</p>`
          : skillsEntries.map(([skill, desc]) => html`
            <div class="skill-item">
              <div class="skill-name">${skill}</div>
              <div class="skill-desc">${desc}</div>
            </div>
          `)}
      </section>
    `;
  }
}

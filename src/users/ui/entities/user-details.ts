import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserDod } from '../../../app/app-domain/dod';
import { usersApi } from '../users-api';
import { UserAR } from '../../domain/user/aroot';
import { userAccessRules } from '../../domain/user/rules/access';
import type { FindUserResult } from '../../../app/ui/base-run/run-types';

@customElement('user-details')
export class UserDetailsEntity extends BaseElement {
  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 8px auto;
      padding: 16px;
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-large);
      font-family: var(--sl-font-sans);
    }

    .header {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .user-info {
      flex: 2;
      min-width: 250px;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .user-text {
      flex: 1;
    }

    .name {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--sl-color-primary-900);
      margin-bottom: 0.5rem;
    }

    .join-date {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
    }

    .actions {
      flex: 1;
      min-width: 150px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      justify-content: center;
      align-items: flex-end;
    }

    .actions sl-button {
      width: 100%;
      max-width: 200px;
    }

    sl-divider {
      margin: 1.5rem 0;
    }

    .status-section {
      margin-bottom: 2rem;
    }

    .status-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--sl-color-primary-800);
    }

    .status-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    .status-table th,
    .status-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--sl-color-neutral-200);
    }

    .status-table th {
      font-weight: 600;
      color: var(--sl-color-neutral-800);
      background-color: var(--sl-color-neutral-100);
    }

    .status-table tr:last-child td {
      border-bottom: none;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .skills-section h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--sl-color-primary-800);
    }

    .user-option-text {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
      margin-top: 0.5rem;
    }

    @media (max-width: 600px) {
      .user-info {
        flex-direction: column;
        text-align: center;
      }

      .actions {
        align-items: center;
      }

      .actions sl-button {
        max-width: 100%;
      }

      .status-table {
        display: block;
        overflow-x: auto;
      }
    }
  `;

  static routingAttrs = {
    pattern: '/users/:userId',
    tag: 'user-details',
  };

  @state()
  private user: UserDod | null = null;

  @state()
  private canEdit: boolean = false;

  async connectedCallback() {
    super.connectedCallback();
    const userId = this.getUserId();
    const result = await this.loadUser(userId);
    if (!result.status) {
      this.app.error('Не удалось загрузать данные пользователя', {
        userId,
        description: 'Пользователя с таким id не существует'
      });
      return;
    }
    this.user = result.success;

    const currentUser = this.app.getState().currentUser;
    if (currentUser) {
      const currentAR = new UserAR(currentUser);
      const targetAR = new UserAR(this.user);
      const isSelf = userAccessRules.canEditSelf(currentAR, targetAR);
      const isModeratorEditingOther = userAccessRules.canModeratorEditOther(currentAR);
      this.canEdit = (isSelf || isModeratorEditingOther);
    }
  }

  protected getUserId(): string {
    return this.app.router.getParams().userId;
  }

  private async loadUser(userId: string): Promise<FindUserResult> {
    return usersApi.findUser(userId);
  }

  private formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  render() {
    if (!this.user) {
      return html`<sl-spinner label="Загрузка пользователя..." style="width:48px; height:48px;"></sl-spinner>`;
    }

    const userAR = new UserAR(this.user);
    const statuses = userAR.statuses;
    const skillsEntries = Object.entries(this.user.profile.skills ?? {});
    const statusStats = this.user.contributions;

    return html`
      <div class="header">
        <div class="user-info">
          <user-avatar size="96" .user=${this.user}></user-avatar>
          <div class="user-text">
            <div class="name">${this.user.name}</div>
            <div class="join-date">
              <sl-icon name="person-plus" style="font-size: 0.9rem;"></sl-icon>
              <span style="margin-left: 0.25rem;">${this.formatDate(this.user.joinedAt)}</span>
            </div>
          </div>
        </div>

        <div class="actions">
          ${this.user.profile.telegramNickname ? html`
            <sl-button
              variant="primary"
              href="https://t.me/${this.user.profile.telegramNickname}"
              target="_blank"
            >
              <sl-icon name="telegram"></sl-icon>
              Написать
            </sl-button>
          ` : null}

          ${this.canEdit ? html`
            <sl-button variant="neutral" @click=${this.onEditClick}>
              <sl-icon name="pencil"></sl-icon>
              Изменить
            </sl-button>
          ` : null}
        </div>
      </div>

      <sl-divider></sl-divider>

      <div class="status-section">
        <h3 class="status-title">Статусы и активность</h3>
        <table class="status-table">
          <thead>
            <tr>
              <th>Статус</th>
              <th>Действий</th>
              <th>Активность</th>
            </tr>
          </thead>
          <tbody>
            ${statuses.map(status => {
              const stat = statusStats[status];
              return html`
                <tr>
                  <td>
                    <div class="status-badge">
                      <user-status-tag .userStatus=${status}></user-status-tag>
                    </div>
                  </td>
                  <td>${stat?.count || 0}</td>
                  <td>
                    ${stat ? html`
                      Первый: ${this.formatDate(stat.firstAt)}<br>
                      Последний: ${this.formatDate(stat.lastAt)}
                    ` : 'Нет данных'}
                  </td>
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>

      <div class="skills-section">
        <h3>Навыки и специализации</h3>
        ${skillsEntries.length === 0
          ? html`<p>Навыки не указаны</p>`
          : skillsEntries.map(([skill, desc]) => html`
            <sl-details summary=${skill}>${desc}</sl-details>
          `)}
      </div>
    `;
  }

  private onEditClick() {
    this.app.router.navigate(`/users/${this.user!.id}/edit`);
  }
}

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
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      min-height: 72px; /* подгоняем под высоту .avatar */
    }

    .name-wrapper {
      margin-bottom: 1.5rem;
    }

    .edit-button {
      white-space: nowrap;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-end;
    }

    .actions sl-button {
      white-space: nowrap;
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

    sl-divider {
      margin: 1rem 0;
    }

    .user-option-text {
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

    return html`
      <div class="header">
        <user-avatar .user=${this.user}></user-avatar>
        <div class="info">
          <div class="name-wrapper">
            <div class="name">${this.user.name}</div>
          </div>
          <div>
              ${statuses.map(s => html`
                <user-status-tag .userStatus=${s}></user-status-tag>
              `)}
            <div class="user-option-text">Присоединился: ${this.formatDate(this.user.joinedAt)}</div>
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

      <section>
        <h3>Навыки и специализации</h3>
        ${skillsEntries.length === 0
          ? html`<p>Навыки не указаны</p>`
          : skillsEntries.map(([skill, desc]) => html`
            <sl-details summary=${skill}>${desc}</sl-details>
          `)}
      </section>
    `;
  }

  private onEditClick() {
    this.app.router.navigate(`/users/${this.user!.id}/edit`);
  }
}


import { html, css, type TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import { UserPolicy } from '#users/domain/user/policy';
import type { UserAttrs } from '#users/domain/user/struct/attrs';
import type { CyOwnerAggregateAttrs } from '#app/core/types';
import type { UserArMeta } from '#users/domain/user/meta';

@customElement('user-details')
export class UserDetailsEntity extends BaseElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      padding: 0;
      box-sizing: border-box;
    }

    .user-details-content-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: var(--sl-color-neutral-0);
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-large);
      font-family: var(--sl-font-sans);
      padding: 16px;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .header {
      display: flex;
      flex-wrap: nowrap;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      position: sticky;
      top: 0;
      z-index: 10;
      background-color: var(--sl-color-neutral-0);
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--sl-color-neutral-200);
      align-items: center;
      justify-content: space-between;
    }

    .user-info {
      flex: 1;
      min-width: 0;
      display: flex;
      gap: 1rem;
      align-items: center;
      overflow: hidden;
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .user-text {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .name {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--sl-color-primary-900);
      margin-bottom: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .join-date {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
    }

    .actions {
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .actions sl-button,
    .actions sl-icon-button {
      flex-shrink: 0;
    }

    sl-divider {
      margin: 1.5rem 0;
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

    @media (max-width: 768px) {
      :host {
        padding-top: 32px;
        box-sizing: border-box;
      }
    }

    @media (max-width: 600px) {
      .user-details-content-wrapper {
        padding: 8px;
      }

      .header {
        flex-direction: row;
        align-items: center;
        text-align: left;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        justify-content: flex-start;
      }

      .user-info {
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        flex-grow: 1;
      }

      .user-text {
        white-space: normal;
        text-overflow: initial;
      }

      .name {
        white-space: normal;
        text-overflow: initial;
        font-size: 1.3rem;
        margin-bottom: 0.2rem;
      }

      .join-date {
        font-size: 0.8rem;
      }

      .actions {
        flex-direction: row;
        justify-content: flex-end;
        width: auto;
        margin-left: auto;
      }

      .actions sl-button,
      .actions sl-icon-button {
        width: auto;
        max-width: unset;
      }
    }
  `;

  @state()
  private user: UserAttrs | null = null;

  @state()
  private canEdit: boolean = false;

  @query('user-details-content')
  private detailsContent!: HTMLElement & { updateSkills(): Promise<void> };

  async connectedCallback() {
    super.connectedCallback();
    this.loadUser();
  }

  protected getUserId(): string {
    return this.app.router.getParams().userId;
  }

  private async loadUser(forceRefresh?: boolean): Promise<void> {
    const userId = this.getUserId();
    if (!userId) return;
    const result = await this.userApi.getUser(userId, forceRefresh);
    if (result.isFailure()) {
      this.app.error('Не удалось загружать данные пользователя', { userId, result: result.value });
      return;
    }
    this.user = result.value;

    const userInfo = this.app.userInfo;
    if (!userInfo.isAuth) return;

    const userPolicy = new UserPolicy(userInfo.user);
    const targetUser = result.value;
    this.canEdit = userPolicy.canEdit(targetUser);
  }

  private formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  private async onEditClick() {
    if (!this.user) return;

    const modal = document.createElement('user-edit');
    const result = await modal.show(this.user);
    if (result) {
      await this.loadUser(true);
    }
  }

  private async onAddSkillClick() {
    if (!this.user || !this.canEdit) {
      this.app.error('Недостаточно прав или данные пользователя не загружены для добавления навыка.');
      return;
    }

    const modal = document.createElement('add-thesis-modal');
    const sectionId = this.user.profile.skillsContentSectionId;
    const ownerName: UserArMeta['name'] = 'UserAr';
    const ownerAttrs: CyOwnerAggregateAttrs = {
      ownerId: this.user.id,
      ownerName,
      access: 'public',
      context: 'user-info',
    };
    try {
      const newContentResult = await modal.show(sectionId, ownerAttrs);
      if (newContentResult) {
        this.detailsContent.updateSkills();
      }
    } catch (error) {
      this.app.error('Ошибка при добавлении навыка.', { details: { error } });
    }
  }

  private openTelegramChat(): void {
    if (this.user?.profile?.telegramNickname) {
      window.open(`https://t.me/${this.user.profile.telegramNickname}`, '_blank');
    } else {
      this.app.error('Никнейм Telegram не указан.');
    }
  }

  protected renderHeaderActions(): TemplateResult {
    const profile = this.user!.profile;
    const availableActions: {
      type: 'telegram' | 'edit-profile' | 'add-skill';
      label: string;
      icon: string;
      handler: () => void;
    }[] = [];

    if (profile.telegramNickname) {
      availableActions.push({
        type: 'telegram',
        label: 'Написать в Telegram',
        icon: 'telegram',
        handler: this.openTelegramChat,
      });
    }

    if (this.canEdit) {
      availableActions.push({
        type: 'edit-profile',
        label: 'Изменить профиль',
        icon: 'pencil',
        handler: this.onEditClick,
      });
      availableActions.push({
        type: 'add-skill',
        label: 'Добавить навык',
        icon: 'plus-square',
        handler: this.onAddSkillClick,
      });
    }

    if (availableActions.length === 0) {
      return html``;
    }

    // Если есть только одно действие, рендерим его как отдельную кнопку
    if (availableActions.length === 1) {
      const action = availableActions[0];
      return html`
        <sl-tooltip content=${action.label} placement="left">
          <sl-button
            size="small"
            variant="primary"
            @click=${action.handler}
          >
            <sl-icon slot="prefix" name=${action.icon}></sl-icon>
          </sl-button>
        </sl-tooltip>
      `;
    }

    const mainAction = availableActions[0];

    return html`
      <sl-button-group>
        <sl-tooltip content=${mainAction.label} placement="left">
          <sl-button
            size="small"
            variant="primary"
            @click=${mainAction.handler}
          >
            <sl-icon slot="prefix" name=${mainAction.icon}></sl-icon>
          </sl-button>
        </sl-tooltip>

        <sl-dropdown placement="bottom-end" hoist>
          <sl-button size="small" slot="trigger" variant="primary" caret > </sl-button>
          <sl-menu>
            ${availableActions.map(action => html`
              <sl-menu-item @click=${action.handler}>
                <sl-icon slot="prefix" name=${action.icon}></sl-icon>
                ${action.label}
              </sl-menu-item>
            `)}
          </sl-menu>
        </sl-dropdown>
      </sl-button-group>
    `;
  }

  render() {
    if (!this.user) {
      return html`<sl-spinner label="Загрузка пользователя..." style="width:48px; height:48px;"></sl-spinner>`;
    }

    return html`
      <div class="user-details-content-wrapper">
        <div class="header">
          <div class="user-info">
            <user-avatar size="96" .user=${this.user}></user-avatar>
            <div class="user-text">
              <div class="name">${this.user.name}</div>
              <div class="join-date">
                <sl-icon name="person-plus" style="font-size: 0.9rem;"></sl-icon>
                <span style="margin-left: 0.25rem;">${this.formatDate(this.user.createAt)}</span>
              </div>
            </div>
          </div>

          <div class="actions">
            ${this.renderHeaderActions()}
          </div>
        </div>

        <user-details-content
          .user=${this.user}
          .canEdit=${this.canEdit}
        > </user-details-content>
      </div>
    `;
  }
}

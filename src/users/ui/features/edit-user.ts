import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserDod, UserRoleNames } from '../../../app/app-domain/dod';
import { usersApi } from '../users-api';
import { UserAR } from '../../domain/user/aroot';
import { userAccessRules } from '../../domain/user/rules/access';
import { USER_ROLE_TITLES, USER_ROLES } from '../../../app/app-domain/constants';
import type { EditUserByKeeterCommand, EditUserCommand } from '../../domain/user/contracts';

@customElement('user-edit')
export class UserEditFeature extends BaseElement {
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

    sl-input, sl-textarea {
      margin-bottom: 1rem;
    }

    .avatar-row {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .avatar-input {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .avatar-box {
      flex: none;
    }

    .skills {
      margin-top: 1rem;
    }
    
    .skills-description {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
      margin-top: 0.5rem;
    }

    .skill-row {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: flex-start;
    }

    sl-textarea {
      flex: 1;
      min-height: 2.5rem; /* минимальная высота */
      overflow: hidden; /* убрать скролл */
      resize: none;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `;

  static routingAttrs = {
    pattern: '/users/:userId/edit',
    tag: 'user-edit',
  };

  @property({ type: Object })
  user: UserDod | undefined;

  @state()
  private name = '';

  @state()
  private roles: UserRoleNames[] = [];

  @state()
  private telegramUsername = '';

  @state()
  private avatarUrl = '';

  @state()
  private skills: [string, string][] = [];

  async connectedCallback() {
    super.connectedCallback();
    this.loadUser();
  }

  async loadUser(): Promise<void> {
    const userId = this.app.router.getParams().userId;
    const result = await usersApi.findUser(userId);
    if (!result.status) {
      this.app.error('Не удалось загрузать данные пользователя', {
        userId,
        description: 'Пользователя с таким id не существует'
      });
      this.app.router.navigate(`/users/${userId}`);
      return;
    }
    this.user = result.success;

    if (!this.checkRules()) {
      this.app.router.navigate(`/users/${userId}`);
    };

    this.name = this.user.name;
    this.roles = [...this.user.roleCounters];
    this.telegramUsername = this.user.telegramNickname ?? '';
    this.avatarUrl = this.user.profile.avatarUrl ?? '';
    this.skills = Object.entries(this.user.profile.skills ?? {});
  }

  private updateSkill(index: number, field: 'name' | 'desc', value: string) {
    const updated = [...this.skills];
    const [name, desc] = updated[index];
    updated[index] = field === 'name' ? [value, desc] : [name, value];
    this.skills = updated;
  }

  private addSkill() {
    this.skills = [...this.skills, ['', '']];
  }

  private removeSkill(index: number) {
    this.skills = this.skills.filter((_, i) => i !== index);
  }

  private async save() {
    if(!(this.checkValidity() && this.checkRules())) return;

    const updated: EditUserByKeeterCommand['dto'] = {
      id: this.user!.id,
      name: this.name,
      roleCounters: this.roles,
      telegramNickname: this.telegramUsername,
      profile: {
        avatarUrl: this.avatarUrl,
        skills: Object.fromEntries(this.skills.filter(([key]) => key.trim()))
      }
    };

    try {
      const result = await usersApi.editUser(updated);
      if (!result.status) {
        this.app.error('Ошибка при сохранении профиля.', result.failure);
        return;
      }
      this.app.info('Профиль обновлён');
      this.app.router.navigate(`/users/${this.user!.id}`);
    } catch (err) {
      this.app.error('Ошибка при сохранении профиля', err);
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
      this.app.info('Заполните все обязательные поля', { variant: 'warning' });
      return false;
    };
    return true;
  }

  private currUserIsKeeter(): boolean {
    const currUserAr = new UserAR(this.app.getState().currentUser);
    return currUserAr.hasRole('KEETER');
  }

  private checkRules(): boolean {
    try {
      const currUserAr = new UserAR(this.app.getState().currentUser);
      const targerUserAr = new UserAR(this.user!);
      const isSelf = userAccessRules.canEditSelf(currUserAr, targerUserAr);
      const isKeeter = userAccessRules.canKeeterEditOther(currUserAr);
      if (!isSelf && !isKeeter) {
        this.app.info('У вас недостаточно прав для редактирования профиля', { variant: 'warning' });
        return false;
      }
    } catch {
      this.app.info('Ошибка инвариантов!');
      return false;
    }
    return true;
  }

  render() {
    if (this.user === undefined) {
      return html`<sl-spinner></sl-spinner>`;
    }
    return html`
      <h2>Редактирование профиля</h2>

      <h3>Основная информация</h3>
      <sl-input
        label="Имя"
        help-text="Как к тебе обращаться?"
        required
        .value=${this.name}
        @sl-input=${(e: CustomEvent) => this.name = (e.target as HTMLInputElement).value}
      ></sl-input>
      
      <div class="avatar-row">
        <div class="avatar-input">
          <sl-input
            label="Аватар URL"
            help-text="Укажи свой аватар!"
            style="height: 100%;"
            .value=${this.avatarUrl}
            @sl-input=${(e: CustomEvent) => this.avatarUrl = (e.target as HTMLInputElement).value}
          ></sl-input>
        </div>

        ${this.avatarUrl && this.avatarUrl.startsWith('http') ? html`
          <user-avatar size="96" .user=${this.user}></user-avatar>
        ` : ''}
      </div>
      
      <sl-input
        label="Ник в Телеграм"
        help-text="Укажи, чтобы к тебе могли обращаться напрямую."
        .value=${this.telegramUsername}
        @sl-input=${(e: CustomEvent) => this.telegramUsername = (e.target as HTMLInputElement).value}
      ></sl-input>

      <sl-select
        label="Роли"
        ?disabled=${!this.currUserIsKeeter()}
        multiple
        .value=${this.roles}
        @sl-change=${(e: CustomEvent) => this.roles = Array.from((e.target as any).value)}
      >
        ${USER_ROLES.map(role => html`<sl-option value=${role}>${USER_ROLE_TITLES[role]}</sl-option>`)}
      </sl-select>

      <sl-divider></sl-divider>

      <div class="skills">
        <h3>Навыки</h3>
        <p class="skills-description">Укажите что вы умеете и может к вам обратятся чтобы получить помощь.</p>
        ${this.skills.map(([skill, desc], i) => html`
          <div class="skill-row">
            <sl-input
              required
              style="width: 150px;"
              placeholder="Ваш навык"
              .value=${skill}
              @sl-input=${(e: any) => this.updateSkill(i, 'name', e.target.value)}
            ></sl-input>

            <sl-textarea
              placeholder="Лучше писать не то что можете делать, а что уже делали (опыт) или чем можете помочь!"
              required
              .value=${desc}
              resize="none"
              @sl-input=${(e: any) => this.updateSkill(i, 'desc', e.target.value)}
            ></sl-textarea>

            <sl-button variant="danger" size="small" @click=${() => this.removeSkill(i)}>✕</sl-button>
          </div>
        `)}
        <sl-button variant="default" size="small" @click=${this.addSkill}>➕ Добавить навык</sl-button>
      </div>

      <div class="actions">
        <sl-button variant="primary" @click=${this.save}>
          <sl-icon name="floppy"></sl-icon>
          Сохранить
        </sl-button>
        <sl-button variant="default" @click=${() => this.app.router.navigate(`/users/${this.user!.id}`)}>
          <sl-icon name="x-lg"></sl-icon>
          Отмена
        </sl-button>
      </div>
    `;
  }
}


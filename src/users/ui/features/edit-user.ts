import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { ContributionKey } from '#app/domain/contributions/types';
import { UserPolicy } from '#app/domain/user/policy';
import type { EditUserCommand } from '#app/domain/user/struct/edit-user';
import type { UserAttrs } from '#app/domain/user/struct/attrs';

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

    .editable-contribution {
      display: grid;
      gap: 1rem;
    }

    .contribution-item {
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: 1rem;
    }

    .contribution-header {
      margin-bottom: 1rem;
    }

    .stat-controls {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    @media (max-width: 600px) {
      .stat-controls {
        grid-template-columns: 1fr;
      }
      
      .contribution-item {
        padding: 0.75rem;
      }
    }
  `;

  @property({ type: Object })
  user: UserAttrs | undefined;

  @state()
  private name = '';

  @state()
  private telegramUsername = '';

  @state()
  private avatarUrl = '';

  @state()
  private skills: [string, string][] = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.loadUser();
  }

  async loadUser(): Promise<void> {
    const userId = this.app.router.getParams().userId;
    const result = await this.userApi.getUser(userId);
    if (result.isFailure()) {
      this.app.error('Не удалось загрузить данные пользователя', {
        userId,
        description: 'Пользователя с таким id не существует'
      });
      this.app.router.navigate(`/users/${userId}`);
      return;
    }
    this.user = result.value;

    if (!this.checkRules()) {
      this.app.router.navigate(`/users/${userId}`);
      return;
    }

    this.name = result.value.name;
    this.telegramUsername = result.value.profile.telegramNickname ?? '';
    this.avatarUrl = result.value.profile.avatarUrl ?? '';
    this.skills = Object.entries(result.value.profile.skills ?? {});
  }

  private canEditStatistics(): boolean {
    if (!this.user) return false;
    const userPolicy = new UserPolicy(this.app.getState().currentUser);
    return userPolicy.isModerator();
  }

  private updateContriburionCount(key: ContributionKey, count: number) {
    if (!this.user || isNaN(count)) return;
    
    this.user = {
      ...this.user,
      statistics: {
        contributions: {
          ...this.user.statistics.contributions,
          [key]: {
            ...this.user.statistics.contributions[key],
            count
          }
        }
      }
    };
  }

  private updateContributionDate(key: ContributionKey, field: 'firstAt' | 'lastAt', dateString: string) {
    if (!this.user || !dateString) return;
    
    const timestamp = new Date(dateString).getTime();
    this.user = {
      ...this.user,
      statistics: {
        contributions: {
          ...this.user.statistics.contributions,
          [key]: {
            ...this.user.statistics.contributions[key],
            [field]: timestamp
          }
        }
      }
    };
  }

  private formatDateInput(timestamp?: number): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
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
    if (!this.checkValidity()) return;
    if (!this.checkRules()) return;

    const updated: EditUserCommand['attrs'] = {
      id: this.user!.id,
      name: this.name,
      profile: {
        avatarUrl: this.avatarUrl,
        skills: Object.fromEntries(this.skills.filter(([key]) => key.trim())),
        telegramNickname: this.telegramUsername,
      }
    };

    if (this.canEditStatistics()) {
      updated.statistics = this.user!.statistics;
    }

    try {
      const result = await this.userApi.editUser(updated);
      if (result.isFailure()) {
        this.app.error('Ошибка при сохранении профиля.', result.value);
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
    }
    return true;
  }

  private checkRules(): boolean {
    if (!this.user) {
      this.app.info('Ошибка: пользователь не загружен для проверки правил доступа.', { variant: 'danger' });
      return false;
    }
    const userPolicy = new UserPolicy(this.app.getState().currentUser);
    if (!userPolicy.canEdit(this.user)) {
      this.app.info('У вас недостаточно прав для редактирования профиля', { variant: 'warning' });
    }
    return true;
  }

  render() {
    if (this.user === undefined) {
      return html`<sl-spinner></sl-spinner>`;
    }

    const canEditStats = this.canEditStatistics();

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
          <user-avatar
            size="96"
            .user=${this.user}
            .shape=${this.avatarUrl.includes('gravatar') ? 'circle' : 'rounded'}
          ></user-avatar>
        ` : ''}
      </div>
      
      <sl-input
        label="Ник в Телеграм"
        help-text="Укажи никнейм телеграма, и к тебе могут обращаться напрямую"
        .value=${this.telegramUsername}
        @sl-input=${(e: CustomEvent) => this.telegramUsername = (e.target as HTMLInputElement).value}
      ></sl-input>

      <sl-divider></sl-divider>
      
      <div class="status-stats">
        <h3>Статусы пользователя</h3>
        
        ${html`
          <div class="editable-contribution">
            ${Object.entries(this.user.statistics.contributions).map(([key, counter]) => html`
              <div class="contribution-item">
                <div class="contribution-header">
                  <user-contribution-tag .contributionKey=${key}></user-contribution-tag>
                </div>
                
                <div class="stat-controls">
                  <sl-input
                    type="number"
                    label="Количество"
                    min="0"
                    .value=${counter.count.toString()}
                    ?disabled=${!canEditStats} <!-- Отключено, если не модератор -->
                    @sl-change=${
                      (e: CustomEvent) => this.updateContriburionCount(
                        key as ContributionKey, parseInt((e.target as HTMLInputElement).value)
                      )
                    }
                  ></sl-input>
                  
                  <sl-input
                    type="date"
                    label="Первое"
                    .value=${this.formatDateInput(counter?.firstAt)}
                    ?disabled=${!canEditStats} <!-- Отключено, если не модератор -->
                    @sl-change=${
                      (e: CustomEvent) => this.updateContributionDate(
                        key as ContributionKey, 'firstAt', (e.target as HTMLInputElement).value
                      )
                    }
                  ></sl-input>
                  
                  <sl-input
                    type="date"
                    label="Последнее"
                    .value=${this.formatDateInput(counter?.lastAt)}
                    ?disabled=${!canEditStats} <!-- Отключено, если не модератор -->
                    @sl-change=${
                      (e: CustomEvent) => this.updateContributionDate(
                        key as ContributionKey, 'lastAt', (e.target as HTMLInputElement).value
                      )
                    }
                  ></sl-input>
                </div>
              </div>
            `)}
          </div>
        `}
      </div>

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
          Отмена
        </sl-button>
      </div>
    `;
  }
}

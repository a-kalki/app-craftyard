import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { UserPolicy } from '#users/domain/user/policy';
import type { EditUserCommand } from '#users/domain/user/struct/edit-user/contract';
import type { UserAttrs, UserProfile } from '#users/domain/user/struct/attrs';
import type { UserArMeta } from '#users/domain/user/meta';
import type { CyOwnerAggregateAttrs } from '#app/core/types';
import { ValidatableElement } from '#app/ui/base/validatable-element';
import type { ValidatorMap } from 'rilata/validator';
import { userProfileVMap, userVMap } from '#users/domain/user/struct/v-map';

type EditUserAttrs = Pick<UserAttrs, 'name'> & {
  telegramNickname: UserProfile['telegramNickname'],
  avatarUrl?: UserProfile['avatarUrl'],
}

@customElement('user-edit')
export class UserEditModal extends ValidatableElement<EditUserAttrs> {
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

    sl-input {
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

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `;

  @property({ type: Object })
  user: UserAttrs | undefined;

  @state() formData!: EditUserAttrs;

  @state() userLoaded = false;

  @state() isLoading = false;

  @state() open = false;

  protected resolve?: (value: boolean) => void;

  protected validatorMap: ValidatorMap<EditUserAttrs> = {
    name: userVMap.name,
    telegramNickname: userProfileVMap.telegramNickname,
    avatarUrl: userProfileVMap.avatarUrl,
  };

  async show(user: UserAttrs): Promise<boolean> {
    this.user = user;

    if (!this.checkRules()) {
      this.app.router.navigate(`/users/${user.id}`);
      return Promise.resolve(false);
    }

    this.formData = {
      name: this.user.name,
      telegramNickname: this.user.profile.telegramNickname,
      avatarUrl: this.user.profile.avatarUrl,
    }
    this.open = true;

    if (!document.body.contains(this)) {
      document.body.appendChild(this);
    }

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  protected async save() {
    if (!this.validateAll() || !this.hasChanged()) {
      this.app.error('Введите корректные данные или внесите изменения.', { errors: this.fieldErrors });
      return;
    }
    this.isLoading = true;
    try {
      const command: EditUserCommand['attrs'] = {
        ...this.user!,
        name: this.formData.name,
        profile: {
          ...this.user!.profile,
          telegramNickname: this.formData.telegramNickname,
          avatarUrl: this.user!.profile.avatarUrl
        }
      }
      const result = await this.userApi.editUser(command);
      if (result.isFailure()) {
        this.app.error('Не удалось обновить пользователя.', { result });
        return;
      }
      this.resolve?.(true);
      this.hide();
    } catch (error) {
      this.app.error('Ошибка при обновлении пользователя', { error });
    } finally {
      this.isLoading = false;
    }
  }

  protected hide(): void {
    this.open = false;
    this.resolve?.(false);
    this.resolve = undefined;
    if (document.body.contains(this)) {
      document.body.removeChild(this);
    }
  }

  protected hasChanged(): boolean {
    return Object.entries(this.formData)
      .some(([key, value]) => {
        if (key === 'name') return value !== this.user!.name
        return value !== this.user!.profile[key as keyof UserProfile]
      });
  }

  protected getFieldValue(field: keyof EditUserAttrs): unknown {
    return this.formData[field];
  }

  protected setFieldValue(field: keyof EditUserAttrs, value: unknown): void {
    this.formData = { ...this.formData, [field]: value };
  }

  private checkRules(): boolean {
    if (!this.user) {
      this.app.info('Ошибка: пользователь не загружен для проверки правил доступа.', { variant: 'danger' });
      return false;
    }
    if (this.app.userInfo.isAuth) {
      const userPolicy = new UserPolicy(this.app.userInfo.user);
      if (userPolicy.canEdit(this.user)) {
        return true;
      }
    }
    this.app.info('У вас недостаточно прав для редактирования профиля', { variant: 'warning' });
    return false;
  }

  handleAvatarChanged(e: CustomEvent<{ id: string, url: string }>): void {
    this.setFieldValue('avatarUrl', e.detail.url);
    e.preventDefault();
  };

  render() {
    if (this.user === undefined) {
      return html`<sl-spinner></sl-spinner>`;
    }

    const ownerName: UserArMeta['name'] = 'UserAr';
    const ownerAttrs: CyOwnerAggregateAttrs = {
      ownerId: this.user.id,
      ownerName,
      context: 'avatar',
      access: 'public'
    }

    return html`
      <sl-dialog
        label="Редактировать пользователя"
        ?open=${this.open}
        @sl-request-close=${this.hide}
      >
        <sl-input
          label="Имя"
          help-text="Как к тебе обращаться?"
          required
          .value=${this.formData.name ?? ''}
          @sl-input=${this.createValidateHandler}
        ></sl-input>
        ${this.renderFieldErrors('name')}
        
        <image-upload-input
          placeholder="Выберите свою аватарку"
          .url=${this.user.profile.avatarUrl}
          .ownerAttrs=${ownerAttrs}
          .aspectRatio=${1/1}
          @file-id-changed=${this.handleAvatarChanged}
        ></image-upload-input>
        
        <sl-input
          label="Ник в Телеграм"
          help-text="Укажи никнейм телеграма, и к тебе могут обращаться напрямую"
          .value=${this.formData.telegramNickname ?? ''}
          @sl-input=${this.createValidateHandler}
        ></sl-input>
        ${this.renderFieldErrors('telegramNickname')}

        <sl-button slot="footer" @click=${this.hide}>Отмена</sl-button>
        <sl-button
          slot="footer"
          variant="primary"
          ?loading=${this.isLoading}
          ?disabled=${!this.hasChanged() || !this.validateAll()}
          @click=${this.save}
        >
          Сохранить
        </sl-button>
      </sl-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-edit': UserEditModal;
  }
}

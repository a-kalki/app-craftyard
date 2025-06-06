import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import type { UserDod, UserStatus } from '../../app-domain/dod';
import { USER_STATUS_ICONS } from '../../app-domain/constants';
import { UserAR } from '../../../users/domain/user/aroot';

@customElement('user-avatar')
export class UserAvatarEntity extends BaseElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .avatar {
      object-fit: cover;
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      background-color: var(--sl-color-neutral-100);
      box-shadow: var(--sl-shadow-small);
    }

    .avatar--circle {
      border-radius: 50%;
    }

    .avatar--rounded {
      border-radius: var(--sl-border-radius-medium);
    }

    .icon-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--sl-color-neutral-100);
      color: var(--sl-color-neutral-600);
      width: 100%;
      aspect-ratio: 1 / 1;
    }
  `;

  @property({ type: Object })
  user!: UserDod;

  @property({ type: String })
  shape: 'circle' | 'rounded' = 'rounded';

  @property({ type: Number })
  size?: number;

  private getDefaultAvatar(status: UserStatus): string {
    const icon = USER_STATUS_ICONS[status];
    return `/assets/assets/icons/${icon}.svg`;
  }

  render() {
    const userAr = new UserAR(this.user);
    const status = userAr.getMaxPriorityStatus();
    const avatarUrl = this.user?.profile?.avatarUrl ?? this.getDefaultAvatar(status);
    const sizePx = this.size ? `${this.size}px` : undefined;
    const borderRadius = this.shape === 'circle' ? '50%' : 'var(--sl-border-radius-medium)';

    if (avatarUrl) {
      return html`
        <img
          class="avatar avatar--${this.shape}"
          src=${avatarUrl}
          alt="User avatar"
          style=${sizePx ? `width: ${sizePx}; height: ${sizePx};` : ''}
        />
      `;
    }

    return html`
      <div
        class="icon-avatar avatar--${this.shape}"
        style=${[
          sizePx ? `width: ${sizePx}; height: ${sizePx};` : '',
          `border-radius: ${borderRadius};`,
        ].join(' ')}
      >
        <sl-icon
          name=${USER_STATUS_ICONS[status]}
          style=${sizePx ? `font-size: calc(${sizePx} * 0.6);` : ''}
        ></sl-icon>
      </div>
    `;
  }
}

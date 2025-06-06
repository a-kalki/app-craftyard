import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import type { UserDod, UserRoleNames } from '../../app-domain/dod';
import { getMaxPriorityRole, USER_ROLE_ICONS } from '../../app-domain/constants';

@customElement('user-avatar')
export class UserAvatarEntity extends BaseElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .avatar {
      object-fit: cover;
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
    }
  `;

  @property({ type: Object })
  user?: UserDod;

  @property({ type: String })
  shape: 'circle' | 'rounded' = 'rounded';

  @property({ type: Number })
  size = 32;

  private getDefaultAvatar(role: UserRoleNames): string {
    const icon = USER_ROLE_ICONS[role];
    return `/assets/icons/${icon}.svg`;
  }

  render() {
    const role = getMaxPriorityRole(this.user?.roleCounters || ['ONLOOKER']);
    const avatarUrl = this.user?.profile?.avatarUrl;
    const size = `${this.size}px`;
    const borderRadius = this.shape === 'circle' ? '50%' : 'var(--sl-border-radius-medium)';

    if (avatarUrl) {
      return html`
        <img
          class="avatar avatar--${this.shape}"
          src=${avatarUrl}
          alt="User avatar"
          style="width: ${size}; height: ${size};"
        />
      `;
    }

    return html`
      <div
        class="icon-avatar avatar--${this.shape}"
        style="
          width: ${size};
          height: ${size};
          border-radius: ${borderRadius};
        "
      >
        <sl-icon
          name=${USER_ROLE_ICONS[role]}
          style="font-size: calc(${size} * 0.6);"
        ></sl-icon>
      </div>
    `;
  }
}

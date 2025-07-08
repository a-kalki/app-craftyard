import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { USER_CONTRIBUTIONS_DETAILS } from '#app/domain/user-contributions/constants';
import { UserAr } from '#app/domain/user/a-root';
import type { UserAttrs } from '#app/domain/user/struct/attrs';
import { BaseElement } from '#app/ui/base/base-element';

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

    .icon-avatar sl-icon {
      font-size: inherit;
      line-height: 1;
      display: block;
      flex-shrink: 0;
      flex-grow: 0;
    }
  `;

  @property({ type: Object })
  user!: UserAttrs;

  @property({ type: String })
  shape: 'circle' | 'rounded' = 'rounded';

  @property({ type: Number })
  size?: number;

  render() {
    const userAr = new UserAr(this.user);
    const key = userAr.getTopContributionKeyByOrder();
    const avatarUrl = this.user?.profile?.avatarUrl;

    const sizePx = this.size ? `${this.size}px` : undefined;

    const borderRadius = this.shape === 'circle' ? '50%' : 'var(--sl-border-radius-medium)';

    if (avatarUrl) {
      return html`
        <img
          class="avatar avatar--${this.shape}"
          src=${avatarUrl}
          alt="User avatar"
          style=${[
            sizePx ? `width: ${sizePx}; height: ${sizePx};` : '',
            `border-radius: ${borderRadius};`
          ].filter(Boolean).join(' ')}
        />
      `;
    }

    const iconFontSize = this.size ? `${this.size * 0.75}px` : '7.5rem';

    return html`
      <div
        class="icon-avatar avatar--${this.shape}"
        style=${[
          sizePx ? `width: ${sizePx}; height: ${sizePx};` : '',
          `border-radius: ${borderRadius};`,
          `font-size: ${iconFontSize};`
        ].filter(Boolean).join(' ')}
      >
        <sl-icon name=${USER_CONTRIBUTIONS_DETAILS[key].icon}></sl-icon>
      </div>
    `;
  }
}

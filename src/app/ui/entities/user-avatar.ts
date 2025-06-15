import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import { CONTRIBUTIONS_DETAILS } from '#app/domain/contributions/constants';
import { UserAr } from '#app/domain/user/a-root';
import type { UserAttrs } from '#app/domain/user/struct/attrs';

@customElement('user-avatar')
export class UserAvatarEntity extends BaseElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .avatar {
      object-fit: cover;
      width: 100%; /* По умолчанию, будет переопределено инлайн-стилем, если 'size' установлен */
      height: auto; /* По умолчанию, будет переопределено инлайн-стилем, если 'size' установлен */
      aspect-ratio: 1 / 1;
      background-color: var(--sl-color-neutral-100);
      box-shadow: var(--sl-shadow-small);
      /* border-radius будет применен инлайн для лучшей гибкости */
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
      width: 100%; /* По умолчанию, будет переопределено инлайн-стилем, если 'size' установлен */
      aspect-ratio: 1 / 1;
      /* font-size: 100% удален, так как он устанавливается динамически через инлайн-стиль */
    }

    .icon-avatar sl-icon {
      /*
       * Иконка должна масштабироваться по font-size, унаследованному от родителя.
       * Мы удаляем width: 100% и height: 100%, чтобы icon-font не пытался
       * растянуться до размеров контейнера до того, как font-size его увеличит.
       * Flexbox центрирует иконку после того, как font-size определит ее размер.
       */
      font-size: inherit; /* Наследуем рассчитанный font-size от .icon-avatar */
      line-height: 1; /* Часто полезно для выравнивания иконочных шрифтов */
      display: block; /* Убедитесь, что иконка ведет себя как блочный элемент для лучшего центрирования */
      flex-shrink: 0; /* Предотвращаем сжатие иконки в flex-контейнере */
      flex-grow: 0; /* Предотвращаем растяжение иконки в flex-контейнере */
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
        <sl-icon name=${CONTRIBUTIONS_DETAILS[key].icon}></sl-icon>
      </div>
    `;
  }
}

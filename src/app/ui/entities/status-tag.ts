import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import {
  USER_STATUS_ICONS,
  USER_STATUS_TITLES,
  USER_STATUS_DESCRIPTIONS
} from '../../app-domain/constants';
import type { UserStatus } from '../../app-domain/dod';

@customElement('user-status-tag')
export class StatusTag extends BaseElement {
  static styles = css`
    :host {
      display: inline-block;
      --scale-factor: 1.2;
      --pulse-duration: 1s;
      --pulse-delay: 10s;
    }

    sl-tag {
      cursor: pointer;
      transform-origin: center;
      will-change: transform;
      filter: none;
      animation: gentlePulse 10s ease infinite;
      display: inline-flex; align-items: center; gap: 0.4em;
    }

    sl-tag:hover {
      filter: none;
      transform: scale(var(--scale-factor));
      box-shadow: var(--sl-shadow-small);
      animation: none;
    }

    sl-tag:active {
      transform: scale(0.98);
      transition-duration: 1.5s;
    }

    @keyframes gentlePulse {
      0%, 90%, 100% {
        transform: scale(1);
      }
      95% {
        transform: scale(var(--scale-factor));
      }
    }
  `;

  @property({ type: String })
  userStatus!: UserStatus;

  getDetails(): { icon: string; title: string; description: string } {
    const icon = USER_STATUS_ICONS[this.userStatus];
    const title = USER_STATUS_TITLES[this.userStatus];
    const description = USER_STATUS_DESCRIPTIONS[this.userStatus];
    return { icon, title, description };
  }

  private showStatusDetails() {
    const { icon, title, description } = this.getDetails();
    this.app.showDialog({
      title: html`
        <div class="status-header" style="display: flex; align-items: center; gap: 0.5em;">
          <sl-icon name=${icon}></sl-icon>
          <span><strong>Описание статуса "${title}"</strong></span>
        </div>
      `,
      content: description,
      confirmText: 'Закрыть',
    });
  }

  render() {
    const { icon, title } = this.getDetails();
    return html`
      <sl-tag 
        size="small"
        variant="success"
        pill
        @click=${this.showStatusDetails}
      >
        <sl-icon name=${icon}></sl-icon>
        <span>&nbsp;|&nbsp;${title}</span>
      </sl-tag>
    `;
  }
}

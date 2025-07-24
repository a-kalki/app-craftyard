import { customElement, property } from 'lit/decorators.js';
import type { UserContributionCounter, UserContributionKey } from '#app/domain/user-contributions/types';
import { USER_CONTRIBUTIONS_DETAILS } from '#app/domain/user-contributions/constants';
import { BaseElement } from '../base/base-element';
import { css, html } from 'lit';

@customElement('user-contribution-tag')
export class ContributionTag extends BaseElement {
  static styles = css`
    :host {
      display: inline-block;
      margin: 2px;
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

    .details-content p {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }

    .details-content strong {
      color: var(--sl-color-primary-600); /* Пример цвета для выделения */
    }
  `;

  @property({ type: String })
  key!: UserContributionKey;

  @property({ type: Object })
  counter!: UserContributionCounter

  getDetails(): { icon: string; title: string; description: string } {
    const icon = USER_CONTRIBUTIONS_DETAILS[this.key].icon;
    const title = USER_CONTRIBUTIONS_DETAILS[this.key].title;
    const description = USER_CONTRIBUTIONS_DETAILS[this.key].description;
    return { icon, title, description };
  }

  private showStatusDetails() {
    const { icon, title, description } = this.getDetails();

    const formatDate = (timestamp: number): string => {
      if (!timestamp) return 'Неизвестно';
      const date = new Date(timestamp);
      return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date);
    };

    const firstContributionDate = formatDate(this.counter.firstAt);
    const lastContributionDate = formatDate(this.counter.lastAt);

    const fullContent = html`
      <div class="details-content">
        <p>${description}</p>
        <hr>
        <p>
          Всего: <strong>${this.counter.count}</strong>
        </p>
        <p>
          Впервые: <strong>${firstContributionDate}</strong>
        </p>
        <p>
          Последний раз: <strong>${lastContributionDate}</strong>
        </p>
      </div>
    `;

    this.app.showDialog({
      title: html`
        <div style="display: flex; align-items: center; gap: 0.5em;">
          <sl-icon name=${icon}></sl-icon>
          <span><strong>Описание вклада: "${title}"</strong></span>
        </div>
      `,
      content: fullContent,
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
        <span>&nbsp;|&nbsp;${title}&nbsp;|&nbsp;${this.counter.count}</span>
      </sl-tag>
    `;
  }
}

import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../base/base-element';
import type { ContributionKey } from '#app/domain/contributions/types';
import { CONTRIBUTIONS_DETAILS } from '#app/domain/contributions/constants';

@customElement('user-contribution-tag')
export class ContributionTag extends BaseElement {
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
  contributionKey!: ContributionKey;

  getDetails(): { icon: string; title: string; description: string } {
    const icon = CONTRIBUTIONS_DETAILS[this.contributionKey].icon;
    const title = CONTRIBUTIONS_DETAILS[this.contributionKey].title;
    const description = CONTRIBUTIONS_DETAILS[this.contributionKey].description;
    return { icon, title, description };
  }

  private showStatusDetails() {
    const { icon, title, description } = this.getDetails();
    this.app.showDialog({
      title: html`
        <div style="display: flex; align-items: center; gap: 0.5em;">
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

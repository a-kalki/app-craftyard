import { html, css, type TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseElement } from '../../../app/ui/base/base-element';
import type { UserContributionCounter, UserContributionKey } from '#users/domain/user-contributions/types';
import { USER_CONTRIBUTIONS_DETAILS } from '#users/domain/user-contributions/constants';

@customElement('user-contribution-card')
export class UserContributionCard extends BaseElement {
  static styles = css`
    :host {
      display: block;
      background-color: var(--sl-color-neutral-50);
      border: 1px solid var(--sl-color-neutral-200);
      border-radius: var(--sl-border-radius-medium);
      padding: var(--sl-spacing-medium);
      box-shadow: var(--sl-shadow-x-small);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--sl-spacing-small);
      min-height: 120px;
      box-sizing: border-box;
    }

    .contribution-icon {
      font-size: 2.5rem;
      color: var(--sl-color-primary-600);
    }

    .contribution-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--sl-color-neutral-800);
      margin: 0;
      line-height: 1.2;
    }

    .contribution-description {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
      margin-top: var(--sl-spacing-x-small);
      line-height: 1.4;
    }

    .contribution-count {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--sl-color-primary-700);
      margin-top: var(--sl-spacing-x-small);
    }

    .contribution-dates {
      font-size: 0.85rem;
      color: var(--sl-color-neutral-600);
      line-height: 1.4;
    }
  `;

  @property({ type: String })
  key!: UserContributionKey;

  @property({ type: Object })
  counter!: UserContributionCounter;

  private formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  render(): TemplateResult {
    const details = USER_CONTRIBUTIONS_DETAILS[this.key];
    if (!details) {
      return html`<p>Неизвестный тип вклада</p>`;
    }

    return html`
      <sl-icon name=${details.icon} class="contribution-icon"></sl-icon>
      <h4 class="contribution-title">${details.title}</h4>
      <div class="contribution-description">${details.description}</div>
      <div class="contribution-count">${this.counter.count || 0}</div>
      <div class="contribution-dates">
        ${this.counter.createAt ? html`Первый: ${this.formatDate(this.counter.createAt)}<br>` : nothing}
        ${this.counter.updateAt ? html`Последний: ${this.formatDate(this.counter.updateAt)}` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'user-contribution-card': UserContributionCard;
  }
}

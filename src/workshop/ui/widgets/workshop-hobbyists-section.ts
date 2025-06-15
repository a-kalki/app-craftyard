import { BaseElement } from "#app/ui/base/base-element";
import type { SubscriptionPlan } from "#workshop/domain/struct/attrs";
import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';

@customElement('workshop-hobbyists-section')
export class WorkshopHobbyistsSection extends BaseElement {
  static styles = css`
    .intro-block {
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-medium);
      padding: 1.5rem;
      color: var(--sl-color-neutral-800);
      line-height: 1.6;
      font-size: 1.05rem;
      box-shadow: var(--sl-shadow-extra-small);
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .plan-card {
      padding: 1.25rem;
      background: var(--sl-color-neutral-0); /* Изменен для лучшей совместимости с фоном секции */
      border-radius: var(--sl-border-radius-medium);
      box-shadow: var(--sl-shadow-medium); /* Чуть более заметная тень */
      border: 1px solid var(--sl-color-neutral-200);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: auto; /* Allow card height to adjust based on content */
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .plan-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--sl-color-primary-700);
    }

    .plan-price {
      font-weight: 700;
      color: var(--sl-color-primary-900);
      font-size: 1.2rem; /* Slightly larger price */
    }

    .plan-duration {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
      margin-bottom: 0.5rem;
    }

    .plan-description {
      font-size: 0.9rem;
      color: var(--sl-color-neutral-600);
      line-height: 1.5;
      flex-grow: 1; /* Описание занимает все доступное пространство */
    }
  `;

  @property({ type: Array })
  plans?: SubscriptionPlan[];

  private getDayText(days: number): string {
    if (days === 1) return 'день';
    if (days > 1 && days < 5) return 'дня';
    return 'дней';
  }

  render() {
    if (!this.plans || this.plans.length === 0) {
      return html`<p>Нет доступных планов подписки.</p>`;
    }

    return html`
      <div class="intro-block">
        Любой человек может прийти и сделать свой проект, используя наши станки и инструменты.
        Также мы предложим вам обустроенное рабочее место и наш опыт.<br><br>
        Исследуйте раздел "Модели", мы уже заготовили чертежи и техпроцессы, чтобы вы могли насладиться творчеством.<br><br>
        Для этого выберите подходящий план подписки. Хотите уменьшенную стоимость?
        Это вполне возможно. Изучите наш сайт или звоните для подробностей.
      </div>

      <sl-divider></sl-divider>

      <div class="plans-grid">
        ${this.plans.map(plan => html`
          <div class="plan-card">
            <div class="plan-header">
              <div class="plan-title">${plan.title}</div>
              <div class="plan-price">${plan.price} ₸</div>
            </div>

            <div class="plan-duration">
              <sl-icon name="clock"></sl-icon>
              <span>${plan.durationDays} ${this.getDayText(plan.durationDays)}</span>
            </div>

            <p class="plan-description">${plan.description}</p>
          </div>
        `)}
      </div>
    `;
  }
}

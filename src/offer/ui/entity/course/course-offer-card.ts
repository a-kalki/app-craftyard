import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CourseOfferAttrs } from '#offer/domain/course/struct/attrs';
import { ModelOfferCard } from '../base/model-offer-card';
import { courseOfferType } from '#offer/domain/course/struct/v-map';

@customElement('course-offer-card')
export class CourseOfferCard extends ModelOfferCard {
  @property({ type: Object }) offer!: CourseOfferAttrs;

  static filterLabel: Record<string, string> = { [courseOfferType]: 'Курсы' }

  offerLabel = 'Курсы';

  offerColor = 'rgba(128, 77, 204, 0.75)';

  static styles = [
    ModelOfferCard.styles,
    css`
      .course-details {
        margin-top: 1rem;
        font-size: 0.95rem;
        color: var(--sl-color-neutral-700);
      }
      .course-details strong {
        color: var(--sl-color-neutral-800);
      }
    `
  ];

  protected renderModelSpecificDetails(): unknown {
    const courseOffer = this.offer as CourseOfferAttrs;
    return html`
      <div class="course-details">
        <div><strong>Длительность курса:</strong> ${courseOffer.durationDays} дней</div>
        <div><strong>Часы работы в мастерской:</strong> ${courseOffer.activeWorkshopHours} ч.</div>
        <div><strong>Минимальное количество студентов:</strong> ${courseOffer.minStudents}</div>
        <div><strong>Максимальное количество студентов:</strong> ${courseOffer.maxStudents}</div>
      </div>
    `;
  }

  // Переопределяем методы для работы с модалками конкретного типа
  protected handleEditClick() {
    this.app.error(`Редактирование курса "${this.offer.title}" (ID: ${this.offer.id})`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'course-offer-card': CourseOfferCard;
  }
}

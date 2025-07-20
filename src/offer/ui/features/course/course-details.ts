import { html, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import type { CourseOfferAttrs } from '#offer/domain/course/struct/attrs';
import { ModelOfferDetails } from '../offer-details';
import { OfferPolicy } from '#offer/domain/policy';

@customElement('course-offer-details')
export class CourseOfferDetails extends ModelOfferDetails {
  protected renderSpecificOfferDetails(): TemplateResult {
    const courseOffer = this.offer as CourseOfferAttrs;

    return html`
      <div class="offer-details-grid">
        <div class="detail-item">
          <strong>Длительность курса:</strong>
          <span>${courseOffer.durationDays} дней</span>
        </div>
        <div class="detail-item">
          <strong>Часы работы в мастерской:</strong>
          <span>${courseOffer.activeWorkshopHours} ч</span>
        </div>
        <div class="detail-item">
          <strong>Мин. студентов:</strong>
          <span>${courseOffer.minStudents}</span>
        </div>
        <div class="detail-item">
          <strong>Макс. студентов:</strong>
          <span>${courseOffer.maxStudents}</span>
        </div>
      </div>
    `;
  }

  protected canEdit(): boolean {
    const userInfo = this.app.assertAuthUser();
    if (!userInfo || !this.offer) return false;

    const policy = new OfferPolicy(userInfo, this.offer);
    return policy.canEditCourse();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'course-offer-details': CourseOfferDetails;
  }
}

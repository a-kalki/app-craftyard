import { customElement } from 'lit/decorators.js';
import { html, type TemplateResult } from 'lit';
import { BaseAddOfferModal } from '../base/base-add-offer-modal';
import type { AddCourseOfferAttrs } from '#offer/domain/crud/add-offer/contract';
import { addCourseOfferVmap } from '#offer/domain/crud/add-offer/v-map';

@customElement('add-course-offer-modal')
export class AddCourseOfferModal extends BaseAddOfferModal<AddCourseOfferAttrs> {
  protected validatorMap = addCourseOfferVmap;

  protected createDefaultOfferAttrs(): Partial<AddCourseOfferAttrs> {
    const workshop = this.app.assertUserWorkshop();
    if (!workshop || !this.modelAttrs || !this.master) {
      this.app.error(
        `[${this.constructor.name}]: Не удалось получить данные мастерской, модели или мастера для инициализации.`,
      );
      return {};
    }

    return {
      title: undefined,
      description: undefined,
      organizationId: workshop.id,
      offerCooperationId: undefined,
      type: 'COURSE_OFFER', // Указываем конкретный тип оффера
      cost: {
        price: 0,
        currency: 'KZT', // Валюта по умолчанию
      },
      modelId: this.modelAttrs.id,
      masterId: this.master.id,
      durationDays: undefined, // Специфичное поле: Длительность курса в днях
      activeWorkshopHours: undefined, // Специфичное поле: Часы работы в мастерской
      minStudents: undefined, // Специфичное поле: Минимальное количество студентов
      maxStudents: undefined, // Специфичное поле: Максимальное количество студентов
    };
  }

  /**
   * Рендерит специфичные поля для предложения курса.
   * Это включает durationDays, activeWorkshopHours, minStudents, maxStudents.
   */
  protected renderSpecificFields(): TemplateResult {
    return html`
      <sl-input
        label="Длительность курса (дни)"
        help-text="Общая продолжительность курса в днях."
        type="number"
        min="0"
        .value=${this.formData.durationDays?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('durationDays')}
      ></sl-input>
      ${this.renderFieldErrors('durationDays')}

      <sl-input
        label="Активные часы в мастерской"
        help-text="Количество часов, проведенных в мастерской в течение курса."
        type="number"
        min="0"
        .value=${this.formData.activeWorkshopHours?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('activeWorkshopHours')}
      ></sl-input>
      ${this.renderFieldErrors('activeWorkshopHours')}

      <sl-input
        label="Минимальное количество студентов"
        help-text="Минимальное количество студентов, необходимое для начала курса."
        type="number"
        min="0"
        .value=${this.formData.minStudents?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('minStudents')}
      ></sl-input>
      ${this.renderFieldErrors('minStudents')}

      <sl-input
        label="Максимальное количество студентов"
        help-text="Максимальное количество студентов, которое может принять курс."
        type="number"
        min="0"
        .value=${this.formData.maxStudents?.toString() ?? ''}
        @sl-input=${this.createValidateHandler('maxStudents')}
      ></sl-input>
      ${this.renderFieldErrors('maxStudents')}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'add-course-offer-modal': AddCourseOfferModal;
  }
}

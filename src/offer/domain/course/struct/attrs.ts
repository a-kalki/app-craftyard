import type { ModelCreationOfferAttrs } from "#offer/domain/base-offer/struct/attrs";

/**
 * @description Пользовательский контент для программы курсов.
 */
export type CourseOfferContentType = 'course-program';

/**
 * @description Предложение обучающего курса/мастер-класса.
 */
export type CourseOfferAttrs = ModelCreationOfferAttrs & {
  type: 'COURSE_OFFER';
  durationDays: number; // Сколько дней займет курс от начала до конца
  activeWorkshopHours: number; // Какое время работы в мастерской нужно для изготовления Изделия
  minStudents: number;
  maxStudents: number;
}

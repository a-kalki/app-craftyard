import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import type { CourseOfferAttrs } from "./attrs";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/domain/base-validators";

const courseOfferType: CourseOfferAttrs['type'] = 'CourseOffer';

export const courseOfferVmap: ValidatorMap<CourseOfferAttrs> = {
  id: modelCreateionOfferVmap.id,
  modelId: modelCreateionOfferVmap.modelId,
  title: modelCreateionOfferVmap.title,
  description: modelCreateionOfferVmap.description,
  ownerId: modelCreateionOfferVmap.ownerId,
  cost: modelCreateionOfferVmap.cost,
  organizationId: modelCreateionOfferVmap.organizationId,
  status: modelCreateionOfferVmap.status,
  estimatedExpenses: modelCreateionOfferVmap.estimatedExpenses,
  offerExecutorsId: modelCreateionOfferVmap.offerExecutorsId,
  editorIds: modelCreateionOfferVmap.editorIds,
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
    new TextStrictEqualValidationRule(courseOfferType),
  ]),
  durationDays: positiveNumberValidator.cloneWithName('durationDays'),
  activeWorkshopHours: positiveNumberValidator.cloneWithName('activeWorkshopHours'),
  minStudents: positiveNumberValidator.cloneWithName('minStudents'),
  maxStudents: positiveNumberValidator.cloneWithName('maxStudents'),
}

export const courseOfferValidator = new DtoFieldValidator(
  'CourseOfferAr', true, { isArray: false }, 'dto', courseOfferVmap,
);

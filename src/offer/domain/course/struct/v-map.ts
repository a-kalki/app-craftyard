import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import type { CourseOfferAttrs } from "./attrs";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/domain/base-validators";

export const courseOfferType: CourseOfferAttrs['type'] = 'COURSE_OFFER';

export const courseOfferVmap: ValidatorMap<CourseOfferAttrs> = {
    id: modelCreateionOfferVmap.id,
    modelId: modelCreateionOfferVmap.modelId,
    title: modelCreateionOfferVmap.title,
    description: modelCreateionOfferVmap.description,
    masterId: modelCreateionOfferVmap.masterId,
    cost: modelCreateionOfferVmap.cost,
    organizationId: modelCreateionOfferVmap.organizationId,
    status: modelCreateionOfferVmap.status,
    estimatedExpenses: modelCreateionOfferVmap.estimatedExpenses,
    offerCooperationId: modelCreateionOfferVmap.offerCooperationId,
    editorIds: modelCreateionOfferVmap.editorIds,
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(courseOfferType),
    ]),
    durationDays: positiveNumberValidator.cloneWithName('durationDays'),
    activeWorkshopHours: positiveNumberValidator.cloneWithName('activeWorkshopHours'),
    minStudents: positiveNumberValidator.cloneWithName('minStudents'),
    maxStudents: positiveNumberValidator.cloneWithName('maxStudents'),
    createAt: modelCreateionOfferVmap.createAt,
    updateAt: modelCreateionOfferVmap.updateAt
}

export const courseOfferValidator = new DtoFieldValidator(
  'CourseOfferAr', true, { isArray: false }, 'dto', courseOfferVmap,
);

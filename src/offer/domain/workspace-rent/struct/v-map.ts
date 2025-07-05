import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/domain/base-validators";
import type { WorkspaceRentOfferAttrs } from "./attrs";

const workspaceRentOfferType: WorkspaceRentOfferAttrs['type'] = 'WorkspaceRent';

export const workspaceRentOfferVmap: ValidatorMap<WorkspaceRentOfferAttrs> = {
    id: modelCreateionOfferVmap.id,
    title: modelCreateionOfferVmap.title,
    description: modelCreateionOfferVmap.description,
    cost: modelCreateionOfferVmap.cost,
    workshopId: modelCreateionOfferVmap.workshopId,
    status: modelCreateionOfferVmap.status,
    estimatedExpenses: modelCreateionOfferVmap.estimatedExpenses,
    offerParticipantId: modelCreateionOfferVmap.offerParticipantId,
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(workspaceRentOfferType),
    ]),
    accessHours: positiveNumberValidator.cloneWithName('accessHours'),
    mastersDiscount: positiveNumberValidator.cloneWithName('mastersDiscount'),
}

export const worksspaceRentOfferValidator = new DtoFieldValidator(
  'WorkspaceRentOfferAr', true, { isArray: false }, 'dto', workspaceRentOfferVmap,
);

import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/domain/base-validators";
import type { HobbyKitOfferAttrs } from "./attrs";
import { workspaceRentOfferVmap } from "#offer/domain/workspace-rent/struct/v-map";

const hobbyKitOfferType: HobbyKitOfferAttrs['type'] = 'HOBBY_KIT_OFFER';

export const hobbyKitOfferVmap: ValidatorMap<HobbyKitOfferAttrs> = {
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
        new TextStrictEqualValidationRule(hobbyKitOfferType),
    ]),
    workshopOfferId: workspaceRentOfferVmap.id.cloneWithName('workshopOfferId'),
    materialPreparationHours: positiveNumberValidator.cloneWithName('materialPreparationHours'),
}

export const hobbyKitOfferValidator = new DtoFieldValidator(
  'CourseOfferAr', true, { isArray: false }, 'dto', hobbyKitOfferVmap,
);

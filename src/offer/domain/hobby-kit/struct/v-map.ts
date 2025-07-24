import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";
import { createAtValidator, positiveNumberValidator, updateAtValidator, userIdValidator } from "#app/domain/base-validators";
import type { HobbyKitOfferAttrs } from "./attrs";
import { workspaceRentOfferVmap } from "#offer/domain/workspace-rent/struct/v-map";

export const hobbyKitOfferType: HobbyKitOfferAttrs['type'] = 'HOBBY_KIT_OFFER';

export const hobbyKitOfferVmap: ValidatorMap<HobbyKitOfferAttrs> = {
    id: modelCreateionOfferVmap.id,
    modelId: modelCreateionOfferVmap.modelId,
    title: modelCreateionOfferVmap.title,
    description: modelCreateionOfferVmap.description,
    organizationId: modelCreateionOfferVmap.organizationId,
    masterId: userIdValidator.cloneWithName('masterId'),
    offerCooperationId: modelCreateionOfferVmap.offerCooperationId,
    status: modelCreateionOfferVmap.status,
    cost: modelCreateionOfferVmap.cost,
    estimatedExpenses: modelCreateionOfferVmap.estimatedExpenses,
    editorIds: modelCreateionOfferVmap.editorIds,
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(hobbyKitOfferType),
    ]),
    workspaceRentOfferId: workspaceRentOfferVmap.id.cloneWithName('workspaceRentOfferId'),
    materialPreparationHours: positiveNumberValidator.cloneWithName('materialPreparationHours'),
    createAt: createAtValidator,
    updateAt: updateAtValidator,
}

export const hobbyKitOfferValidator = new DtoFieldValidator(
  'CourseOfferAr', true, { isArray: false }, 'dto', hobbyKitOfferVmap,
);

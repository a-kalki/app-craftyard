import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { offerAttrsVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/domain/base-validators";
import type { WorkspaceRentOfferAttrs } from "./attrs";

const workspaceRentOfferType: WorkspaceRentOfferAttrs['type'] = 'WorkspaceRentOffer';

export const workspaceRentOfferVmap: ValidatorMap<WorkspaceRentOfferAttrs> = {
    id: offerAttrsVmap.id,
    title: offerAttrsVmap.title,
    description: offerAttrsVmap.description,
    cost: offerAttrsVmap.cost,
    organizationId: offerAttrsVmap.organizationId,
    status: offerAttrsVmap.status,
    estimatedExpenses: offerAttrsVmap.estimatedExpenses,
    offerExecutorsId: offerAttrsVmap.offerExecutorsId,
    editorIds: offerAttrsVmap.editorIds,
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(workspaceRentOfferType),
    ]),
    accessHours: positiveNumberValidator.cloneWithName('accessHours'),
    mastersDiscount: positiveNumberValidator.cloneWithName('mastersDiscount'),
}

export const worksspaceRentOfferValidator = new DtoFieldValidator(
  'WorkspaceRentOfferAr', true, { isArray: false }, 'dto', workspaceRentOfferVmap,
);

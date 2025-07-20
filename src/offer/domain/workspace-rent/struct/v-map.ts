import { DtoFieldValidator, LiteralFieldValidator, RangeNumberValidationRule, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { offerAttrsVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/domain/base-validators";
import type { WorkspaceRentOfferAttrs } from "./attrs";

const workspaceRentOfferType: WorkspaceRentOfferAttrs['type'] = 'WORKSPACE_RENT_OFFER';

export const workspaceRentOfferVmap: ValidatorMap<WorkspaceRentOfferAttrs> = {
    id: offerAttrsVmap.id,
    title: offerAttrsVmap.title,
    description: offerAttrsVmap.description,
    cost: offerAttrsVmap.cost,
    organizationId: offerAttrsVmap.organizationId,
    status: offerAttrsVmap.status,
    offerCooperationId: offerAttrsVmap.offerCooperationId,
    editorIds: offerAttrsVmap.editorIds,
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(workspaceRentOfferType),
    ]),
    accessHours: positiveNumberValidator.cloneWithName('accessHours'),
    mastersDiscount: new LiteralFieldValidator(
      'mastersDiscount', true, { isArray: false }, 'number', [
        new RangeNumberValidationRule(0, 1),
      ]
    ),
    createAt: offerAttrsVmap.createAt,
    updateAt: offerAttrsVmap.updateAt
}

export const worksspaceRentOfferValidator = new DtoFieldValidator(
  'WorkspaceRentOfferAr', true, { isArray: false }, 'dto', workspaceRentOfferVmap,
);

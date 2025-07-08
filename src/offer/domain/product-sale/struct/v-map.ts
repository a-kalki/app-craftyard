import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/domain/base-validators";
import type { ProductSaleOfferAttrs } from "./attrs";

const productSaleOfferType: ProductSaleOfferAttrs['type'] = 'ProductSaleOffer';

export const productSaleOfferVmap: ValidatorMap<ProductSaleOfferAttrs> = {
    id: modelCreateionOfferVmap.id,
    modelId: modelCreateionOfferVmap.modelId,
    title: modelCreateionOfferVmap.title,
    description: modelCreateionOfferVmap.description,
    cost: modelCreateionOfferVmap.cost,
    organizationId: modelCreateionOfferVmap.organizationId,
    status: modelCreateionOfferVmap.status,
    estimatedExpenses: modelCreateionOfferVmap.estimatedExpenses,
    offerExecutorsId: modelCreateionOfferVmap.offerExecutorsId,
    editorIds: modelCreateionOfferVmap.editorIds,
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(productSaleOfferType),
    ]),
    ownerId: modelCreateionOfferVmap.ownerId,
    productionTimeDays: positiveNumberValidator.cloneWithName('productionTimeDays'),
}

export const productSaleOfferValidator = new DtoFieldValidator(
  'productSaleOfferAr', true, { isArray: false }, 'dto', productSaleOfferVmap,
);

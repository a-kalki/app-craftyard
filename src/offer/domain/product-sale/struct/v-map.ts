import { DtoFieldValidator, LiteralFieldValidator, TextStrictEqualValidationRule, type ValidatorMap } from "rilata/validator";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";
import { positiveNumberValidator } from "#app/core/base-validators";
import type { ProductSaleOfferAttrs } from "./attrs";

export const productSaleOfferType: ProductSaleOfferAttrs['type'] = 'PRODUCT_SALE_OFFER';

export const productSaleOfferVmap: ValidatorMap<ProductSaleOfferAttrs> = {
    id: modelCreateionOfferVmap.id,
    modelId: modelCreateionOfferVmap.modelId,
    title: modelCreateionOfferVmap.title,
    description: modelCreateionOfferVmap.description,
    cost: modelCreateionOfferVmap.cost,
    organizationId: modelCreateionOfferVmap.organizationId,
    status: modelCreateionOfferVmap.status,
    estimatedExpenses: modelCreateionOfferVmap.estimatedExpenses,
    offerCooperationId: modelCreateionOfferVmap.offerCooperationId,
    editorIds: modelCreateionOfferVmap.editorIds,
    type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
        new TextStrictEqualValidationRule(productSaleOfferType),
    ]),
    masterId: modelCreateionOfferVmap.masterId,
    productionTimeDays: positiveNumberValidator.cloneWithName('productionTimeDays'),
    createAt: modelCreateionOfferVmap.createAt,
    updateAt: modelCreateionOfferVmap.updateAt
}

export const productSaleOfferValidator = new DtoFieldValidator(
  'productSaleOfferAr', true, { isArray: false }, 'dto', productSaleOfferVmap,
);

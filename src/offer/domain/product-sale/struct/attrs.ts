import type { ModelCreationOfferAttrs } from "#offer/domain/base-offer/struct/attrs";

/**
 * @description Предложение продажи готового изделия.
 */
export type ProductSaleOfferAttrs = ModelCreationOfferAttrs & {
  type: 'ProductSaleOffer';
  productionTimeDays: number; // Срок изготовления в днях
}

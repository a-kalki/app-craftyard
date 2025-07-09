import type { ModelCreationOfferAttrs } from "#offer/domain/base-offer/struct/attrs";

/**
 * @description Предложение продажи готового изделия.
 */
export type ProductSaleOfferAttrs = ModelCreationOfferAttrs & {
  type: 'PRODUCT_SALE_OFFER';
  productionTimeDays: number; // Срок изготовления в днях
}

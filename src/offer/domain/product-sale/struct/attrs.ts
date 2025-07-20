import type { ModelOfferAttrs } from "#offer/domain/base-offer/struct/attrs";

/**
 * @description Предложение продажи готового изделия.
 */
export type ProductSaleOfferAttrs = ModelOfferAttrs & {
  type: 'PRODUCT_SALE_OFFER';
  productionTimeDays: number; // Срок изготовления в днях
}

import { BaseOfferAr } from "../base-offer/a-root";
import type { ProductSaleOfferMeta } from "./meta";
import type { ProductSaleOfferAttrs } from "./struct/attrs";
import { productSaleOfferValidator } from "./struct/v-map";

export class ProductSaleOfferAR extends BaseOfferAr<ProductSaleOfferMeta> {
  name = "ProductSaleOfferAr" as const;

  constructor(attrs: ProductSaleOfferAttrs) {
    super(attrs, productSaleOfferValidator);
  }
}

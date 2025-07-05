import type { CourseOfferAttrs } from "#offer/domain/course/struct/attrs";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import type { ProductSaleOfferAttrs } from "#offer/domain/product-sale/struct/attrs";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";
import type { CourseOfferAR } from "../course/a-root";
import type { HobbyKitOfferAR } from "../hobby-kit/a-root";
import type { OfferAttrs } from "../offers";
import type { ProductSaleOfferAR } from "../product-sale/a-root";
import type { WorkspaceRentOfferAR } from "../workspace-rent/a-root";
import type { BaseOfferAr } from "./a-root";
import type { BaseOfferArMeta } from "./meta";

export type GetOfferClass<C extends OfferAttrs> = 
  C extends CourseOfferAttrs
    ? CourseOfferAR
    : C extends HobbyKitOfferAttrs
      ? HobbyKitOfferAR
      : C extends ProductSaleOfferAttrs
        ? ProductSaleOfferAR
        : C extends WorkspaceRentOfferAttrs
          ? WorkspaceRentOfferAR
          : BaseOfferAr<BaseOfferArMeta>

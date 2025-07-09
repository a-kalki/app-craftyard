import type { CourseOfferAttrs } from "#offer/domain/course/struct/attrs";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import type { ProductSaleOfferAttrs } from "#offer/domain/product-sale/struct/attrs";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";
import type { BaseOfferAttrs } from "./base-offer/struct/attrs";
import type { CourseOfferAR } from "./course/a-root";
import type { HobbyKitOfferAR } from "./hobby-kit/a-root";
import type { ProductSaleOfferAR } from "./product-sale/a-root";
import type { WorkspaceRentOfferAR } from "./workspace-rent/a-root";

export type OfferAttrs =
  WorkspaceRentOfferAttrs
  | ProductSaleOfferAttrs
  | HobbyKitOfferAttrs
  | CourseOfferAttrs

export type OfferAr =
  WorkspaceRentOfferAR
  | ProductSaleOfferAR
  | HobbyKitOfferAR
  | CourseOfferAR

export type OfferTypes = OfferAttrs['type'];

export type OfferDbo = 
  Omit<
    Partial<WorkspaceRentOfferAttrs>
    & Partial<ProductSaleOfferAttrs>
    & BaseOfferAttrs,
    'type'
  > & Pick<OfferAttrs, 'type'>;

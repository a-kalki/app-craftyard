import type { CourseOfferAttrs } from "./course/struct/attrs";
import type { HobbyKitOfferAttrs } from "./hobby-kit/struct/attrs";
import type { ProductSaleOfferAttrs } from "./product-sale/struct/attrs";
import type { WorkspaceRentOfferAttrs } from "./workspace-rent/struct/attrs";

export type OfferAttrs =
  WorkspaceRentOfferAttrs
  | ProductSaleOfferAttrs
  | HobbyKitOfferAttrs
  | CourseOfferAttrs

export type OfferTypes = OfferAttrs['type'];

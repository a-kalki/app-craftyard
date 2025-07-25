import type { AddingIsNotPermittedError, AggregateDoesNotExistError, DomainRuleError } from "#app/core/errors";
import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";
import type { CourseOfferAttrs } from "#offer/domain/course/struct/attrs";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import type { ProductSaleOfferAttrs } from "#offer/domain/product-sale/struct/attrs";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";

export type AddWorkspaceRentOfferAttrs = Omit<
  WorkspaceRentOfferAttrs,
  'id' |  'status' | 'estimatedExpenses' | 'editorIds' |
  'createAt' | 'updateAt'
>;

export type AddHobbyKitOfferAttrs = Omit<
  HobbyKitOfferAttrs,
  'id' | 'status' | 'estimatedExpenses' | 'editorIds' |
  'createAt' | 'updateAt'
>;

export type AddProductSaleOfferAttrs = Omit<
  ProductSaleOfferAttrs,
  'id' | 'status' | 'estimatedExpenses' | 'editorIds' |
  'createAt' | 'updateAt'
>;

export type AddCourseOfferAttrs = Omit<
  CourseOfferAttrs,
  'id' | 'status' | 'estimatedExpenses' | 'editorIds' |
  'createAt' | 'updateAt'
>;

// ========== commands ============
export type AddOfferCommand = {
  name: 'add-offer',
  attrs: AddWorkspaceRentOfferAttrs
    | AddHobbyKitOfferAttrs
    | AddProductSaleOfferAttrs
    | AddCourseOfferAttrs,
  requestId: string,
};

// ========== success ============
export type AddOfferSuccess = { id: string };

// ========== uc-meta ============
export type AddOfferMeta = {
  name: 'Add Offer Use Case'
  in: AddOfferCommand,
  success: AddOfferSuccess,
  errors: AggregateDoesNotExistError | AddingIsNotPermittedError | DomainRuleError,
  events: never,
  aRoot: BaseOfferArMeta,
}


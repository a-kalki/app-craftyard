import type { EditingIsNotPermittedError, AggregateDoesNotExistError } from "#app/domain/errors";
import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";
import type { PatchValue } from "rilata/core";

export type EditHobbyKitAttrs = Pick<
  HobbyKitOfferAttrs,
  'id' | 'type' | 'title' | 'description' | 'offerCooperationId' |
  'cost' | 'estimatedExpenses' | 'workshopOfferId' | 'materialPreparationHours'
>;

export type EditWorkspaceRentAttrs = Pick<
  WorkspaceRentOfferAttrs,
  'id' | 'type' | 'title' | 'description' | 'offerCooperationId' |
  'cost' | 'accessHours' | 'mastersDiscount'
>;

export type EditOfferAttrs =
  PatchValue<EditHobbyKitAttrs>
  | PatchValue<EditWorkspaceRentAttrs>;

// ========== commands ============
export type EditOfferCommand = {
  name: 'edit-offer',
  attrs: EditWorkspaceRentAttrs | EditHobbyKitAttrs,
  requestId: string,
};

// ========== success ============
export type EditOfferSuccess = 'success';

// ========== uc-meta ============
export type EditOfferMeta = {
  name: 'Edit Offer Use Case'
  in: EditOfferCommand,
  success: EditOfferSuccess,
  errors: AggregateDoesNotExistError | EditingIsNotPermittedError,
  events: never,
  aRoot: BaseOfferArMeta,
}


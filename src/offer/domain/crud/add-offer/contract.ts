import type { AddingIsNotPermittedError, AggregateDoesNotExistError } from "#app/domain/errors";
import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";

export type AddWorkspaceRentAttrs = Omit<
  WorkspaceRentOfferAttrs,
  'id' |  'status' | 'estimatedExpenses' | 'editorIds' |
  'createAt' | 'updateAt'
>;

export type AddHobbyKitAttrs = Omit<
  HobbyKitOfferAttrs,
  'id' | 'status' | 'estimatedExpenses' | 'editorIds' |
  'ownerId' | 'createAt' | 'updateAt'
>;

// ========== commands ============
export type AddOfferCommand = {
  name: 'add-offer',
  attrs: AddWorkspaceRentAttrs | AddHobbyKitAttrs,
  requestId: string,
};

// ========== success ============
export type AddOfferSuccess = { id: string };

// ========== uc-meta ============
export type AddOfferMeta = {
  name: 'Add Offer Use Case'
  in: AddOfferCommand,
  success: AddOfferSuccess,
  errors: AggregateDoesNotExistError | AddingIsNotPermittedError,
  events: never,
  aRoot: BaseOfferArMeta,
}


import type { DeletingIsNotPermittedError, AggregateDoesNotExistError } from "#app/domain/errors";
import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";

// ========== commands ============
export type DeleteOfferCommand = {
  name: 'delete-offer',
  attrs: { offerId: string },
  requestId: string,
};

// ========== success ============
export type DeleteOfferSuccess = 'success';

// ========== uc-meta ============
export type DeleteOfferMeta = {
  name: 'Delete Offer Use Case'
  in: DeleteOfferCommand,
  success: DeleteOfferSuccess,
  errors: AggregateDoesNotExistError | DeletingIsNotPermittedError,
  events: never,
  aRoot: BaseOfferArMeta,
}


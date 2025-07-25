import type { AggregateDoesNotExistError } from "#app/core/errors";
import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";
import type { OfferAttrs } from "#offer/domain/types";

// ========== commands ============
export type GetOfferCommand = {
  name: 'get-offer',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetOfferSuccess = OfferAttrs;

// ========== uc-meta ============
export type GetOfferMeta = {
  name: 'Get Offer Case'
  in: GetOfferCommand,
  success: GetOfferSuccess,
  errors: AggregateDoesNotExistError,
  events: never,
  aRoot: BaseOfferArMeta,
}


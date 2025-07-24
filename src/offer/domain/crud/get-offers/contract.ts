import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";
import type { OfferAttrs } from "#offer/domain/types";

// ========== commands ============
export type GetOffersCommand = {
  name: 'get-offers',
  attrs: Partial<OfferAttrs>,
  requestId: string,
};

// ========== success ============
export type GetOfferSuccess = OfferAttrs[];

// ========== uc-meta ============
export type GetOffersMeta = {
  name: 'Get Offers Case'
  in: GetOffersCommand,
  success: GetOfferSuccess,
  errors: never,
  events: never,
  aRoot: BaseOfferArMeta,
}


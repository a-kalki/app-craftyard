import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";
import type { OfferAttrs } from "#offer/domain/types";

// ========== commands ============
export type GetMasterOffersCommand = {
  name: 'get-master-offers',
  attrs: { masterId: string },
  requestId: string,
};

// ========== success ============
export type GetMasterOffersSuccess = OfferAttrs[];

// ========== uc-meta ============
export type GetMasterOffersMeta = {
  name: 'Get Master Offers Case'
  in: GetMasterOffersCommand,
  success: GetMasterOffersSuccess,
  errors: never,
  events: never,
  aRoot: BaseOfferArMeta,
}


import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";
import type { OfferAttrs } from "#offer/domain/types";

// ========== commands ============
export type GetWorkshopOffersCommand = {
  name: 'get-workshop-offers',
  attrs: { organizationId: string },
  requestId: string,
};

// ========== success ============
export type GetWorkshopOffersSuccess = OfferAttrs[];

// ========== uc-meta ============
export type GetWorkshopOffersMeta = {
  name: 'Get Workshop Offers Case'
  in: GetWorkshopOffersCommand,
  success: GetWorkshopOffersSuccess,
  errors: never,
  events: never,
  aRoot: BaseOfferArMeta,
}


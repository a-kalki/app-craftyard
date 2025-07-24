import type { MaybePromise } from "rilata/core";
import type { OfferAttrs } from "./types";

export interface OfferRepo {
  findOffer(id: string): MaybePromise<OfferAttrs | undefined>

  filterOffers(attrs: Partial<OfferAttrs>): MaybePromise<OfferAttrs[]>

  getOffers<O extends OfferAttrs>(attrs: Partial<O>): MaybePromise<O[]>

  addOffer(attrs: OfferAttrs): MaybePromise<{ changes: number }>

  editOffer(attrs: OfferAttrs): MaybePromise<{ changes: number }>

  deleteOffer(offerId: string): MaybePromise<{ changes: number }>

  getWorkshopOffers(workshopId: string): MaybePromise<OfferAttrs[]>

  getMasterOffers(userId: string): MaybePromise<OfferAttrs[]>
}

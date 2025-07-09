import type { MaybePromise } from "rilata/core";
import type { OfferAttrs } from "./types";

export interface OfferRepo {
  findOffer(id: string): MaybePromise<OfferAttrs | undefined>

  filterOffers(attrs: Partial<OfferAttrs>): MaybePromise<OfferAttrs[]>

  getOffers(): MaybePromise<OfferAttrs[]>
}

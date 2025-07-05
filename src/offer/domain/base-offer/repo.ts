import type { MaybePromise } from "rilata/core";
import type { OfferAttrs } from "../offers";

export interface OfferRepo {
  findOffer(id: string): MaybePromise<OfferAttrs | undefined>
}

import type { BackendResultByMeta, Caller } from "rilata/core";
import type { GetOfferMeta } from "./crud/get-offer/contract";

export interface ApiOfferFacade {
  getOffer(id: string, caller: Caller, reqId: string): Promise<BackendResultByMeta<GetOfferMeta>>
}

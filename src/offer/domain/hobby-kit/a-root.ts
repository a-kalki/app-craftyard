import { BaseOfferAr } from "../base-offer/a-root";
import type { HobbyKitOfferMeta } from "./meta";
import type { HobbyKitOfferAttrs } from "./struct/attrs";
import { hobbyKitOfferValidator } from "./struct/v-map";

export class HobbyKitOfferAR extends BaseOfferAr<HobbyKitOfferMeta> {
  name = "HobbyKitOfferAr" as const;

  constructor(attrs: HobbyKitOfferAttrs) {
    super(attrs, hobbyKitOfferValidator);
  }
}

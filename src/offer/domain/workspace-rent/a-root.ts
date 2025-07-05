import { BaseOfferAr } from "../base-offer/a-root";
import type { WorkspaceRentOfferMeta } from "./meta";
import type { WorkspaceRentOfferAttrs } from "./struct/attrs";
import { worksspaceRentOfferValidator } from "./struct/v-map";

export class WorkspaceRentOfferAR extends BaseOfferAr<WorkspaceRentOfferMeta> {
  name = "WorkspaceRentOfferAr" as const;

  constructor(attrs: WorkspaceRentOfferAttrs) {
    super(attrs, worksspaceRentOfferValidator);
  }
}

import type { Cost } from "#app/core/types";
import { costUtils } from "#app/core/utils/cost/cost-utils";
import { BaseOfferAr } from "../base-offer/a-root";
import type { WorkspaceRentOfferMeta } from "./meta";
import type { WorkspaceRentOfferAttrs } from "./struct/attrs";
import { worksspaceRentOfferValidator } from "./struct/v-map";

export class WorkspaceRentOfferAR extends BaseOfferAr<WorkspaceRentOfferMeta> {
  name = "WorkspaceRentOfferAr" as const;

  constructor(attrs: WorkspaceRentOfferAttrs) {
    super(attrs, worksspaceRentOfferValidator);
  }

  getRentCost(): Cost {
    return this.attrs.cost;
  }

  getMasterRentCost(): Cost {
    return costUtils.percent(this.attrs.cost, 1 - this.attrs.mastersDiscount);
  }
}

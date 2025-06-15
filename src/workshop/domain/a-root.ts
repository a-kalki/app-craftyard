import { AggregateRoot } from "rilata/domain";
import type { WorkshopArMeta } from "./meta";
import type { WorkshopAttrs } from "./struct/attrs";
import { workshopValidator } from "./v-map";

export class WorkshopAr extends AggregateRoot<WorkshopArMeta> {
    name = "WorkshopAr" as const;

    getShortName(): string {
      return this.getAttrs().title;
    }

    constructor(attrs: WorkshopAttrs) {
      super(attrs, workshopValidator)
    }
}


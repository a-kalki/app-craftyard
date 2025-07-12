import { BaseOfferAr } from "../base-offer/a-root";
import type { EditOfferAttrs } from "../crud/edit-offer/contract";
import type { CourseOfferMeta } from "./meta";
import type { CourseOfferAttrs } from "./struct/attrs";
import { courseOfferValidator } from "./struct/v-map";

export class CourseOfferAR extends BaseOfferAr<CourseOfferMeta> {
  name = "CourseOfferAr" as const;

  constructor(attrs: CourseOfferAttrs) {
    super(attrs, courseOfferValidator);
  }

  update(attrs: EditOfferAttrs): void {
    throw new Error("Method not implemented.");
  }
}

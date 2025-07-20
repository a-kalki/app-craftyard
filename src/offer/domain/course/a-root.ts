import { BaseOfferAr } from "../base-offer/a-root";
import type { CourseOfferMeta } from "./meta";
import type { CourseOfferAttrs } from "./struct/attrs";
import { courseOfferValidator } from "./struct/v-map";

export class CourseOfferAR extends BaseOfferAr<CourseOfferMeta> {
  name = "CourseOfferAr" as const;

  constructor(attrs: CourseOfferAttrs) {
    super(attrs, courseOfferValidator);
  }
}

import { AggregateRoot } from "rilata/domain"
import type { BaseOfferArMeta } from "./meta";

export abstract class BaseOfferAr<AR extends BaseOfferArMeta> extends AggregateRoot<AR> {
  getShortName(): string {
    return this.attrs.title;
  }
}

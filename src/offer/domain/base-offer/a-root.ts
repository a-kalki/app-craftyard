import { AggregateRoot } from "rilata/domain"
import type { BaseOfferArMeta } from "./meta";
import type { EditOfferAttrs } from "../crud/edit-offer/contract";
import { dtoUtility } from "rilata/utils";

export abstract class BaseOfferAr<META extends BaseOfferArMeta> extends AggregateRoot<META> {
  getShortName(): string {
    return this.attrs.title;
  }

  update(patch: EditOfferAttrs): void {
    // @ts-expect-error: непонятная ошибка типа;
    this.attrs = dtoUtility.applyPatch(this.attrs, { ...patch, updateAt: Date.now() });
  }
}

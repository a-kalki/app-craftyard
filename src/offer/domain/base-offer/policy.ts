import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { OfferAttrs } from "../offers";

export class OfferPolicy {
  constructor(protected user: JwtUser, protected offer: OfferAttrs) {}

  canEdit(): boolean {
    return this.offer.editorIds.includes(this.user.id);
  }
}

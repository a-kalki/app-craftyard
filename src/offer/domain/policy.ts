import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { OfferAttrs } from "./types";

export class OfferPolicy {
  protected userPolicy: UserPolicy;

  constructor(protected user: JwtUser, protected offer: OfferAttrs) {
    this.userPolicy = new UserPolicy(user);
  }

  canEdit(): boolean {
    return this.userPolicy.isModerator() || this.offer.editorIds.includes(this.user.id);
  }
}

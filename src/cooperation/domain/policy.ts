import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { CooperationAttrs } from "./types";

export class CooperationPolicy {
  protected userPolicy: UserPolicy;

  constructor(protected user: JwtUser, protected attrs: CooperationAttrs) {
    this.userPolicy = new UserPolicy(user);
  }

  canEdit(): boolean {
    return this.userPolicy.isModerator() || this.isEditor();
  }

  isEditor(): boolean {
    return (
      this.attrs.type === 'OFFER_COOPERATION' || this.attrs.type === 'ORGANIZATION_COOPERATION'
      && this.attrs.editorIds.includes(this.user.id)
    )
  }

  canAdd(): boolean {
    return this.canEdit();
  }
}

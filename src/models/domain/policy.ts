import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { ModelAttrs } from "./struct/attrs";

export class ModelPolicy {
  private userPolicy: UserPolicy;
  constructor(private currentUser: JwtUser) {
    this.userPolicy = new UserPolicy(currentUser);
  }

  canEdit(model: ModelAttrs): boolean {
    return this.isOwner(model) || this.userPolicy.isModerator();;
  }

  isOwner(model: ModelAttrs): boolean {
    return this.currentUser.id === model.owner;
  }
}


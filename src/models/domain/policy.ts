import type { CyOwnerAggregateAttrs } from "#app/domain/types";
import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { ModelAttrs } from "./struct/attrs";

export class ModelPolicy {
  private userPolicy: UserPolicy;

  constructor(private currentUser: JwtUser, private model: ModelAttrs) {
    this.userPolicy = new UserPolicy(currentUser);
  }

  canEdit(): boolean {
    return this.isOwner() || this.userPolicy.isModerator();;
  }

  notCanEdit(): boolean {
    return !this.canEdit();
  }

  isOwner(): boolean {
    return this.currentUser.id === this.model.ownerId;
  }

  canEditUserContent(ownerAttrs: CyOwnerAggregateAttrs): boolean {
    return this.canEdit();
  }

  canGetUserContent(ownerAttrs: CyOwnerAggregateAttrs): boolean {
    return this.canEdit();
  }

  canGetFile(ownerAttrs: CyOwnerAggregateAttrs): boolean {
    return this.canEdit();
  }


  canEditFile(ownerAttrs: CyOwnerAggregateAttrs): boolean {
    return this.canEdit();
  }
}


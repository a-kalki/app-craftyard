import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { OwnerAggregateAttrs } from "rilata/api-server";
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

  canEditUserContent(ownerAttrs: OwnerAggregateAttrs): boolean {
    return this.canEdit();
  }

  canGetUserContent(ownerAttrs: OwnerAggregateAttrs): boolean {
    return this.canEdit();
  }
}


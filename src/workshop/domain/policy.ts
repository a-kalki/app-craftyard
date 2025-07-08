import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { WorkshopAttrs } from "./struct/attrs";

export class WorkshopPolicy {
  protected userPolicy: UserPolicy;
  constructor(
    private user: JwtUser,
    private workshop: WorkshopAttrs,
  ) {
    this.userPolicy = new UserPolicy(this.user);
  }

  canEdit(): boolean {
    return this.workshop.editorIds.includes(this.user.id) || this.userPolicy.isModerator();
  }

  canAddProductSaleOffer(): boolean {
    return this.workshop.masterIds.includes(this.user.id);
  }

  canAddHobbyKitOffer(): boolean {
    return this.workshop.masterIds.includes(this.user.id);
  }

  canAddCourseOffer(): boolean {
    return this.workshop.mentorIds.includes(this.user.id);
  }

  isEmpoyee(): boolean {
    return this.workshop.mentorIds.includes(this.user.id);
  }
}


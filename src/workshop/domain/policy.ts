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

  isEditor(): boolean {
    return this.workshop.editorIds.includes(this.user.id) || this.userPolicy.isModerator();
  }

  canEdit(): boolean {
    return this.isEditor() || this.userPolicy.isModerator()
  }

  isEmpoyee(): boolean {
    return this.workshop.employeeIds.includes(this.user.id);
  }

  canAddWorkshopRentOffer(): boolean {
    return this.workshop.editorIds.includes(this.user.id);
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
}


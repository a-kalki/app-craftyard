import { UserPolicy } from "#app/domain/user/policy";
import type { JwtUser } from "#app/domain/user/struct/attrs";
import { WorkshopPolicy } from "#workshop/domain/policy";
import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";
import type { OfferAttrs } from "./types";

export class OfferPolicy {
  protected userPolicy: UserPolicy;

  constructor(protected user: JwtUser, protected offer: OfferAttrs) {
    this.userPolicy = new UserPolicy(user);
  }

  canEdit(): boolean {
    return this.userPolicy.isModerator() || this.isEditor() || this.isOfferMaster();
  }

  canEditWorkspaceRent(workshop: WorkshopAttrs): boolean {
    const workshopPolicy = new WorkshopPolicy(this.user, workshop);
    return this.offer.type === 'WORKSPACE_RENT_OFFER' && (
      this.canEdit() || workshopPolicy.isEditor()
    )
  }

  canEditHobbiKit(): boolean {
    return this.offer.type === 'HOBBY_KIT_OFFER' && this.canEdit()
  }

  canEditProductSale(): boolean {
    return this.offer.type === 'PRODUCT_SALE_OFFER' && this.canEdit()
  }

  canEditCourse(): boolean {
    return this.offer.type === 'COURSE_OFFER' && this.canEdit()
  }

  isEditor(): boolean {
    return this.offer.editorIds.includes(this.user.id);
  }

  isOfferMaster(): boolean {
    return this.offer.type !== 'WORKSPACE_RENT_OFFER' && this.offer.masterId === this.user.id;
  }
}

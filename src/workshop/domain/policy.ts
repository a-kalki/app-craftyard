import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { WorkshopAttrs } from "./struct/attrs";

export class WorkshopPolicy {
  constructor(
    private user: JwtUser,
    private workshop: WorkshopAttrs,
  ) {}

  canEditWorkshop(): boolean {
    return this.workshop.editorIds.includes(this.user.id);
  }
}


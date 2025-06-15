import type { JwtUser } from "#app/domain/user/struct/attrs";
import type { WorkshopAttrs, WorkshopMembership, WorkshopPrivelegies } from "./struct/attrs";

export class WorkshopPolicy {
  constructor(
    private currentUser: JwtUser,
    private memberships: WorkshopMembership[]
  ) {}

  canEditWorkshop(workshop: WorkshopAttrs): boolean {
    return this.hasPrivilege(workshop, 'CAN_ALL');
  }

  canManageSubscriptions(workshop: WorkshopAttrs): boolean {
    return this.hasPrivilege(workshop, 'CAN_ALL');
  }

  canModifyCommission(workshop: WorkshopAttrs): boolean {
    return this.hasPrivilege(workshop, 'CAN_MODIFY_COMMISSION') || this.hasPrivilege(workshop, 'CAN_ALL');
  }

  private hasPrivilege(workshop: WorkshopAttrs, privilege: WorkshopPrivelegies): boolean {
    return this.memberships.some(m =>
      m.workshopId === workshop.id &&
      m.userId === this.currentUser.id &&
      (!m.leftAt || new Date(m.leftAt).getTime() > Date.now()) &&
      m.privileges.includes(privilege)
    );
  }
}


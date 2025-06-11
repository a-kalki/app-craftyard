import { appUserRules } from "../../../../app/domain/rules";
import type { UserAR } from "./a-root";

class UserAccessRules {
  canEditSelf(currentUser: UserAR, targetUser: UserAR): boolean {
    return currentUser.id === targetUser.id;
  }

  canModeratorEditOther(currentUser: UserAR): boolean {
    return appUserRules.canModeratorEditOther(currentUser.getUserDod());
  }
}

export const userAccessRules = new UserAccessRules();

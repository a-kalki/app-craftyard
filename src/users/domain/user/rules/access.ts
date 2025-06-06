import type { UserAR } from "../aroot";

class UserAccessRules {
  canEditSelf(currentUser: UserAR, targetUser: UserAR): boolean {
    return currentUser.id === targetUser.id;
  }

  canKeeterEditOther(currentUser: UserAR): boolean {
    return currentUser.hasRole('KEETER');
  }
}

export const userAccessRules = new UserAccessRules();

import type { UserAR } from "../aroot";

class UserAccessRules {
  canEditSelf(currentUser: UserAR, targetUser: UserAR): boolean {
    return currentUser.id === targetUser.id;
  }

  canModeratorEditOther(currentUser: UserAR): boolean {
    return currentUser.hasStatus('MODERATOR');
  }
}

export const userAccessRules = new UserAccessRules();

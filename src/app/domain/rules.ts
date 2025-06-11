import type { AppUser } from "./types";

export class AppUserRules {
  canModeratorEditOther(currentUser: AppUser): boolean {
    return Boolean(currentUser.support?.isModerator);
  }
}

export const appUserRules = new AppUserRules();

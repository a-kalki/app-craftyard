import type { JwtUser, UserAttrs } from './user';

export class UserPolicy {
  constructor(private currentUser: UserAttrs | JwtUser) {}

  canEdit(targetUser: UserAttrs): boolean {
    return this.isSelf(targetUser) || this.isModerator();
  }

  canViewPrivateProfile(targetUser: UserAttrs): boolean {
    return this.isSelf(targetUser) || this.isModerator();
  }

  isSelf(targetUser: UserAttrs): boolean {
    return this.currentUser.id === targetUser.id;
  }

  isModerator(): boolean {
    return !!this.currentUser.support?.isModerator;
  }
}

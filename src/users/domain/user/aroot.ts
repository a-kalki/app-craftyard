import { USER_ROLES } from "../../../app/app-domain/constants";
import type { UserDod, UserRoleNames } from "../../../app/app-domain/dod";

export class UserAR {
  private user: UserDod;

  constructor(user: UserDod) {
    this.user = user;
    this.checkInvariants();
  }

  getUserDod(copy = true): UserDod {
    return copy ? { ...this.user } : this.user;
  }

  get id(): string {
    return this.user.id;
  }

  get roles(): UserRoleNames[] {
    return this.user.roleCounters;
  }

  hasRole(role: UserRoleNames): boolean {
    return this.user.roleCounters.includes(role);
  }

  hasAnyRole(roles: UserRoleNames[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  protected checkInvariants(): void {
    const idIsValid = this.user.id.length > 0;
    const nameIsValid = this.user.name.length > 0;
    const rolesIsValid = this.user.roleCounters.length > 0 && this.user.roleCounters.every(r => USER_ROLES.includes(r));
    const joinedAtIsValid = this.user.joinedAt > 0 && this.user.joinedAt < Date.now();
    const skills = this.user.profile.skills;
    const skillsIsValid =
      (typeof skills === 'object')
      && Object.values(skills).every(v => (typeof v === 'string') && v.length > 0);

    if (idIsValid && nameIsValid && rolesIsValid && joinedAtIsValid && skillsIsValid) {
      return;
    }
    console.log('Invalid user invariants:', this.user);
    throw new Error('Invalid user invariants');
  }
}

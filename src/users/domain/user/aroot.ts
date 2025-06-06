import { USER_STATUSES } from "../../../app/app-domain/constants";
import type { UserDod, UserStatus } from "../../../app/app-domain/dod";

export class UserAR {
  private user: UserDod;

  constructor(user: UserDod) {
    this.user = user;
    this.checkInvariants();
  }

  getUserDod(copy = true): UserDod {
    return copy ? structuredClone(this.user) : this.user;
  }

  get id(): string {
    return this.user.id;
  }

  get statuses(): UserStatus[] {
    return Object.keys(this.user.statusStats) as UserStatus[];
  }

  get skills(): string[] {
    return Object.keys(this.user.profile.skills ?? {});
  }

  hasStatus(status: UserStatus): boolean {
    return Boolean(this.user.statusStats?.[status]);
  }

  hasAnyStatus(statuses: UserStatus[]): boolean {
    return statuses.some(status => this.hasStatus(status));
  }

  getMaxPriorityStatus(): UserStatus {
    return this.statuses
      .filter((s): s is UserStatus => USER_STATUSES.includes(s))
      .sort((a, b) => USER_STATUSES.indexOf(b) - USER_STATUSES.indexOf(a))[0];
  }

  protected checkInvariants(): void {
    const { id, name, statusStats, joinedAt, profile } = this.user;

    const idIsValid = id.length > 0;
    const nameIsValid = name.length > 0;

    const statuses = Object.keys(statusStats ?? {}) as UserStatus[];
    const statusesAreValid =
      statuses.length > 0 &&
      statuses.every(status => USER_STATUSES.includes(status)) &&
      statuses.every(status => {
        const s = statusStats?.[status];
        return s && s.count >= 0 && s.firstAt > 0 && s.lastAt >= s.firstAt;
      });

    const joinedAtIsValid = joinedAt > 0 && joinedAt < Date.now();

    const skills = profile.skills;
    const skillsAreValid =
      typeof skills === 'object' &&
      Object.values(skills ?? {}).every(v => typeof v === 'string' && v.length > 0);

    if (!idIsValid || !nameIsValid || !statusesAreValid || !joinedAtIsValid || !skillsAreValid) {
      console.log('Invalid user invariants:', this.user);
      throw new Error('Invalid user invariants');
    }
  }
}

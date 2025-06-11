import { AggregateRoot } from "rilata/domain";
import type { UserArMeta, UserAttrs } from "../struct/meta";

export class UserAR extends AggregateRoot<UserArMeta> {
  name = "UserAr" as const;

  getShortName(): string {
    return this.getAttrs().name;
  }

  constructor(user: UserAttrs, version: number) {
    super(
      user,
      version,
      invariantsValidator: DtoFieldValidator<string, true, false, META['attrs']>,
    )

  }

  getUserDod(copy = true): UserDod {
    return copy ? structuredClone(this.user) : this.user;
  }

  get id(): string {
    return this.user.id;
  }

  getContributions(copy = true): Contributions {
    return copy ? structuredClone(this.user.statistics.contributions) : this.user.statistics.contributions;
  }

  getContributionKeys(): ContributionKey[] {
    return Object.keys(this.user.statistics.contributions) as ContributionKey[];
  }

  hasContribution(type: ContributionKey): boolean {
    return Boolean(this.user.statistics.contributions[type]);
  }

  hasAnyContribution(types: ContributionKey[]): boolean {
    return types.some(type => this.hasContribution(type));
  }
  getMaxPriorityContribution(): ContributionKey | undefined {
    const allKeys = Object.keys(CONTRIBUTION_KEYS) as ContributionKey[];
    return allKeys.find(key => this.hasContribution(key));
  }

  getSkills(copy = true): Skills {
    return copy ? structuredClone(this.user.profile.skills ?? {}) : this.user.profile.skills ?? {};
  }

  getSkillKeys(): string[] {
    return Object.keys(this.user.profile.skills ?? {});
  }

  protected checkInvariants(): void {
    const { id, name, statistics, joinedAt, profile } = this.user;
    const { contributions } = statistics;
    const errors: string[] = [];

    if (!id || id.length === 0) {
      errors.push('Invalid ID: ID is empty');
    }

    if (!name || name.length === 0) {
      errors.push('Invalid Name: Name is empty');
    }

    const keys = Object.keys(contributions ?? {}) as ContributionKey[];
    keys.forEach(key => {
      const stat = contributions[key];
      if (CONTRIBUTION_KEYS.includes(key)) {
        errors.push(`Unknown contribution type: '${key}'`);
      }
      if (!stat) {
        errors.push(`Missing data for contribution '${key}'`);
      } else {
        if (stat.count === undefined || stat.count < 0) {
          errors.push(`Invalid count for '${key}'`);
        }
        if (!stat.firstAt || stat.firstAt <= 0) {
          errors.push(`Invalid firstAt for '${key}'`);
        }
        if (!stat.lastAt || stat.lastAt < stat.firstAt) {
          errors.push(`Invalid lastAt for '${key}'`);
        }
      }
    });

    if (!joinedAt || joinedAt <= 0 || joinedAt > Date.now()) {
      errors.push('Invalid joinedAt');
    }

    if (profile.skills && typeof profile.skills === 'object') {
      Object.entries(profile.skills).forEach(([skill, value]) => {
        if (!value || typeof value !== 'string') {
          errors.push(`Invalid Skill '${skill}' value '${value}'`);
        }
      });
    }

    if (errors.length > 0) {
      console.group('User Invariant Violations');
      console.log('User Object:', this.user);
      errors.forEach(error => console.error(error));
      console.groupEnd();
      throw new Error(`User invariants violated:\n${errors.join('\n')}`);
    }
  }
}

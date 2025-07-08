import { AggregateRoot } from "rilata/domain";
import { userInvariantsValidator } from "./v-map";
import type { UserContributionKey, UserContributions } from "../user-contributions/types";
import { USER_CONTRIBUTIONS_DETAILS } from "../user-contributions/constants";
import type { UserArMeta } from "./meta";
import type { Skills, UserAttrs } from "./struct/attrs";

export class UserAr extends AggregateRoot<UserArMeta> {
  name = "UserAr" as const;
  
  constructor(attrs: UserAttrs) {
    super(attrs, userInvariantsValidator);
  }

  getShortName(): string {
    return this.getAttrs().name
  }

  getContributions(): UserContributions {
    return this.getAttrs().statistics.contributions;
  }
  
  getContributionKeys(): UserContributionKey[] {
    return Object.keys(this.getAttrs().statistics.contributions) as UserContributionKey[];
  }

  getTopContributionKeyByOrder(): UserContributionKey {
    const keys = this.getContributionKeys();
    return keys.sort((a, b) => (
      USER_CONTRIBUTIONS_DETAILS[b].orderNumber - USER_CONTRIBUTIONS_DETAILS[a].orderNumber
    ))[0];
  }

  // Метод для проверки, есть ли у пользователя определённая роль
  hasContribution(key: UserContributionKey): boolean {
    return this.getContributionKeys().includes(key);
  }

  getSkills(): Skills {
    return this.getAttrs().profile.skills;
  }
}

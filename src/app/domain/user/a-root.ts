import { AggregateRoot } from "rilata/domain";
import { userInvariantsValidator } from "./v-map";
import type { ContributionKey, Contributions } from "../contributions/types";
import { CONTRIBUTIONS_DETAILS } from "../contributions/constants";
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

  getContributions(): Contributions {
    return this.getAttrs().statistics.contributions;
  }
  
  getContributionKeys(): ContributionKey[] {
    return Object.keys(this.getAttrs().statistics.contributions) as ContributionKey[];
  }

  getTopContributionKeyByOrder(): ContributionKey {
    const keys = this.getContributionKeys();
    return keys.sort((a, b) => (
      CONTRIBUTIONS_DETAILS[b].orderNumber - CONTRIBUTIONS_DETAILS[a].orderNumber
    ))[0];
  }

  // Метод для проверки, есть ли у пользователя определённая роль
  hasContribution(key: ContributionKey): boolean {
    return this.getContributionKeys().includes(key);
  }

  getSkills(): Skills {
    return this.getAttrs().profile.skills;
  }
}

import { AggregateRoot } from "rilata/domain";
import type { UserContributionKey, UserContributions } from "../user-contributions/types";
import { USER_CONTRIBUTIONS_DETAILS } from "../user-contributions/constants";
import type { UserArMeta } from "./meta";
import type { UserAttrs } from "./struct/attrs";
import { userInvariantsValidator } from "./struct/v-map";

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

  hasContribution(key: UserContributionKey): boolean {
    return this.getContributionKeys().includes(key);
  }

  incrementContribution(key: UserContributionKey): boolean {
    const now = Date.now();

    let currentContribution = this.attrs.statistics.contributions[key];

    if (currentContribution) {
      currentContribution.count++;
      currentContribution.updateAt = now;
    } else {
      // Если вклад новый, инициализируем его
      this.attrs.statistics.contributions[key] = {
        count: 1,
        createAt: now,
        updateAt: now,
      };
    }

    // Обновляем общее время обновления пользователя
    this.attrs.updateAt = now;

    return true;
  }
}

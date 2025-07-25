import { UserPolicy } from "#users/domain/user/policy";
import type { UserAttrs } from "#users/domain/user/struct/attrs";

export class ContributionPolicy {
  protected userPolicy: UserPolicy;

  constructor(protected user: UserAttrs) {
    this.userPolicy = new UserPolicy(user);
  }

  canAddModel(): boolean {
    // пока только для моделарторов.
    // в будущем нужно определить метрики по которым можно добавлять
    // или позволить любому добавлять.
    return this.userPolicy.isModerator();
  }
}

import type {
  IncrementContributionCommand, IncrementContributionMeta,
} from "#users/domain/user-contributions/struct/increment/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { UserUseCase } from "../base-uc";
import { incrementContributionValidator } from "#users/domain/user-contributions/struct/increment/v-map";
import { failure, success } from "rilata/core";

export class IncrementContributionUC extends UserUseCase<IncrementContributionMeta> {
    arName = "UserAr" as const;

    name = "Increment User Contribution Use Case" as const;

    inputName = "increment-user-contribution" as const;

    protected validator = incrementContributionValidator;

    protected supportAnonimousCall = false;

    async runDomain(
      input: IncrementContributionCommand, reqScope: RequestScope,
    ): Promise<DomainResult<IncrementContributionMeta>> {
      const { userId } = input.attrs;
      const arResult = await this.getUserAr(userId);
      if (arResult.isFailure()) {
        return failure(arResult.value);
      }
      const userAr = arResult.value;
      userAr.incrementContribution(input.attrs.key);
      const saveResult = await this.moduleResolver.userRepo.updateUser(userId, userAr.getAttrs());
      if (saveResult.changes === 0) {
        throw this.logger.error(
          `[${this.constructor.name}]: не удалось обновить данные пользователя в БД.`,
          { attrs: userAr.getAttrs() }
        );
      }
      return success(true);
    }

}

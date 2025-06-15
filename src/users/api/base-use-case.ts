import { UserAr } from "#app/domain/user/a-root";
import type { UserAttrs } from "#app/domain/user/struct/attrs";
import type { UserDoesNotExistError } from "#app/ui/base-run/run-types";
import type { UsersModuleResolvers } from "#users/api/types";
import { QueryUseCase } from "rilata/api";
import { failure, success, type Result, type UCMeta } from "rilata/core";

export abstract class UserUseCase<META extends UCMeta> extends QueryUseCase<
  UsersModuleResolvers, META
> {
  protected transactionStrategy!: never;

  async getUserAttrs(userId: string): Promise<Result<UserDoesNotExistError, UserAttrs>> {
    const userAttrs = await this.moduleResolver.db.findUser(userId);
    if (!userAttrs) {
      return failure({
        name: 'UserDoesNotExistError',
        type: 'domain-error',
      });
    }
    return success(userAttrs);
  }

  async getUserAr(userId: string): Promise<Result<UserDoesNotExistError, UserAr>> {
    const result = await this.getUserAttrs(userId);
    if (result.isFailure()) return failure(result.value);
    return success(new UserAr(result.value));
  }
}

import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success } from "rilata/core";
import { UserUseCase } from "#users/api/base-uc";
import type { GetUserCommand, GetUserMeta } from "#app/domain/user/struct/get-user/contract";
import { getUserValidator } from "#app/domain/user/struct/get-user/v-map";

export class GetUserUC extends UserUseCase<GetUserMeta> {
  arName = "UserAr" as const;

  name = "Get User Use Case" as const;

  inputName = "get-user" as const;

  protected supportAnonimousCall = true;

  protected validator = getUserValidator;

  async runDomain(
    input: GetUserCommand, requestData: RequestScope,
  ): Promise<DomainResult<GetUserMeta>> {
    const user = await this.moduleResolver.userRepo.findUser(input.attrs.id);
    return user
      ? success(user)
      : failure({
        name: 'UserDoesNotExistError',
        type: 'domain-error',
      });
  }
}

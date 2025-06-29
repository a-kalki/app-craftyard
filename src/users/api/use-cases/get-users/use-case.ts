import type { RequestScope, DomainResult } from "rilata/api";
import { success } from "rilata/core";
import { getUsersValidator } from "./v-map";
import { UserUseCase } from "#users/api/base-uc";
import type { GetUsersCommand, GetUsersMeta } from "#app/domain/user/struct/get-users";

export class GetUsersUC extends UserUseCase<GetUsersMeta> {
  protected supportAnonimousCall = true;

  arName = 'UserAr' as const;

  name = 'Get Users Use Case' as const;

  inputName = 'get-users' as const;

  protected validator = getUsersValidator;

  async runDomain(
    input: GetUsersCommand, requestData: RequestScope,
  ): Promise<DomainResult<GetUsersMeta>> {
    return success(await this.moduleResolver.userRepo.getUsers());
  }
}

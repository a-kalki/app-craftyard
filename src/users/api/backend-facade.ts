import type { ApiUserFacade } from "#app/domain/user/facade";
import type { GetUserCommand, GetUserMeta } from "#app/domain/user/struct/get-user/contract";
import type { GetUsersCommand, GetUsersMeta } from "#app/domain/user/struct/get-users/contract";
import type { Caller, BackendResultByMeta } from "rilata/core";
import type { UsersModule } from "./module";

export class UsersBackendFacade implements ApiUserFacade {
  constructor(private module: UsersModule) {}

  getUser(input: GetUserCommand, caller: Caller): Promise<BackendResultByMeta<GetUserMeta>> {
      throw new Error("Method not implemented.");
  }

  getUsers(input: GetUsersCommand, caller: Caller): Promise<BackendResultByMeta<GetUsersMeta>> {
      throw new Error("Method not implemented.");
  }
}

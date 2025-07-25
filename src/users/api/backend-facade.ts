import type { ApiUserFacade } from "#users/domain/user/facade";
import type { GetUserCommand, GetUserMeta } from "#users/domain/user/struct/get-user/contract";
import type { GetUsersCommand, GetUsersMeta } from "#users/domain/user/struct/get-users/contract";
import type { Caller, BackendResultByMeta } from "rilata/core";
import type { UsersModule } from "./module";

export class UsersBackendFacade implements ApiUserFacade {
  constructor(private module: UsersModule) {}

  async getUser(userId: string, caller: Caller, requestId: string): Promise<BackendResultByMeta<GetUserMeta>> {
    const command: GetUserCommand = {
      name: "get-user",
      attrs: { id: userId },
      requestId
    }
    return this.module.handleRequest(
      command, { caller }
    ) as unknown as BackendResultByMeta<GetUserMeta>
  }

  async getUsers(
    input: GetUsersCommand, caller: Caller, requestId: string,
  ): Promise<BackendResultByMeta<GetUsersMeta>> {
    const command: GetUsersCommand = {
      name: "get-users",
      attrs: input.attrs,
      requestId: requestId,
    }
    return this.module.handleRequest(command, { caller }) as unknown as BackendResultByMeta<GetUsersMeta>
  }
}

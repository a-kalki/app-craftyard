import type { ApiUserFacade } from "#users/domain/user/facade";
import type { GetUserCommand, GetUserMeta } from "#users/domain/user/struct/get-user/contract";
import type { GetUsersCommand, GetUsersMeta } from "#users/domain/user/struct/get-users/contract";
import type { Caller, BackendResultByMeta } from "rilata/core";
import type { UsersModule } from "./module";
import type { IncrementContributionAttrs, IncrementContributionCommand, IncrementContributionMeta } from "#users/domain/user-contributions/struct/increment/contract";
import type { UserAttrs } from "#users/domain/user/struct/attrs";

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
    attrs: Partial<UserAttrs>, caller: Caller, requestId: string,
  ): Promise<BackendResultByMeta<GetUsersMeta>> {
    const command: GetUsersCommand = {
      name: "get-users",
      attrs,
      requestId: requestId,
    }
    return this.module.handleRequest(command, { caller }) as unknown as BackendResultByMeta<GetUsersMeta>
  }

  async incrementContribuition(
    attrs: IncrementContributionAttrs,
    caller: Caller,
    requestId: string,
  ): Promise<BackendResultByMeta<IncrementContributionMeta>> {
    const command: IncrementContributionCommand = {
      name: "increment-user-contribution",
      attrs,
      requestId,
    };
    return this.module.handleRequest(
      command, { caller },
    ) as unknown as BackendResultByMeta<IncrementContributionMeta>
  }
}

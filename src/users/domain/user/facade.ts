import type { BackendResultByMeta, Caller } from "rilata/core";
import type { GetUsersMeta } from "../user/struct/get-users/contract";
import type { RefreshUserCommand, RefreshUserMeta } from "../user/struct/refresh-user/contract";
import type { GetUserMeta } from "../user/struct/get-user/contract";
import type { AuthUserMeta } from "../user/struct/auth-user/contract";
import type { AuthData } from "./struct/auth-user/contract";
import type { IncrementContributionAttrs, IncrementContributionMeta } from "../user-contributions/struct/increment/contract";
import type { UserAttrs } from "./struct/attrs";

export interface UiUserFacade {
  authUser(dto: AuthData): Promise<BackendResultByMeta<AuthUserMeta>>;

  getUser(userId: string): Promise<BackendResultByMeta<GetUserMeta>>;

  refreshUser(dto: RefreshUserCommand['attrs']): Promise<BackendResultByMeta<RefreshUserMeta>>;

  getUsers(): Promise<BackendResultByMeta<GetUsersMeta>>
}

export interface ApiUserFacade {
  getUser(userId: string, caller: Caller, reqId: string): Promise<BackendResultByMeta<GetUserMeta>>;

  getUsers(attrs: Partial<UserAttrs>, caller: Caller, reqId: string): Promise<BackendResultByMeta<GetUsersMeta>>

  incrementContribuition(
    attrs: IncrementContributionAttrs,
    caller: Caller,
    requestId: string,
  ): Promise<BackendResultByMeta<IncrementContributionMeta>>
}

import type { BackendResultByMeta, Caller } from "rilata/core";
import type { GetUsersCommand, GetUsersMeta } from "../user/struct/get-users/contract";
import type { RefreshUserCommand, RefreshUserMeta } from "../user/struct/refresh-user/contract";
import type { GetUserCommand, GetUserMeta } from "../user/struct/get-user/contract";
import type { AuthUserMeta } from "../user/struct/auth-user/contract";
import type { AuthData } from "./struct/auth-user/contract";

export interface UiUserFacade {
  authUser(dto: AuthData): Promise<BackendResultByMeta<AuthUserMeta>>;

  getUser(userId: string): Promise<BackendResultByMeta<GetUserMeta>>;

  refreshUser(dto: RefreshUserCommand['attrs']): Promise<BackendResultByMeta<RefreshUserMeta>>;

  getUsers(): Promise<BackendResultByMeta<GetUsersMeta>>
}

export interface ApiUserFacade {
  getUser(input: GetUserCommand, caller: Caller): Promise<BackendResultByMeta<GetUserMeta>>;

  getUsers(input: GetUsersCommand, caller: Caller): Promise<BackendResultByMeta<GetUsersMeta>>
}

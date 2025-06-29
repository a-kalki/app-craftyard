import type { BackendResultByMeta, Caller } from "rilata/core";
import type { GetUsersCommand, GetUsersMeta } from "../user/struct/get-users";
import type { RefreshUserCommand, RefreshUserMeta } from "../user/struct/refresh-user";
import type { GetUserCommand, GetUserMeta } from "../user/struct/get-user";
import type { AuthUserMeta } from "../user/struct/auth-user";
import type { AuthData } from "./struct/auth-user";

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

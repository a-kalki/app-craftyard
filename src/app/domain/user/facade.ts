import type { BackendResultByMeta } from "rilata/core";
import type { GetUsersMeta } from "../user/struct/get-users";
import type { RefreshUserCommand, RefreshUserMeta } from "../user/struct/refresh-user";
import type { GetUserMeta } from "../user/struct/get-user";
import type { AuthUserMeta } from "../user/struct/auth-user";
import type { AuthData } from "./struct/auth-user";

export interface UserFacade {
  authUser(dto: AuthData): Promise<BackendResultByMeta<AuthUserMeta>>;

  getUser(userId: string): Promise<BackendResultByMeta<GetUserMeta>>;

  refreshUser(dto: RefreshUserCommand['attrs']): Promise<BackendResultByMeta<RefreshUserMeta>>;

  getUsers(forceRefresh?: boolean): Promise<BackendResultByMeta<GetUsersMeta>>
}


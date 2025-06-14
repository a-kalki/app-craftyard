import type { AuthUserMeta } from "#app/domain/user/struct/auth-user";
import type { GetUserMeta } from "#app/domain/user/struct/get-user";
import type { RefreshUserCommand, RefreshUserMeta } from "#app/domain/user/struct/refresh-user";
import type { BackendResultByMeta } from "rilata/core";

export type UserDoesNotExistError = {
  name: 'UserDoesNotExistError',
  type: 'domain-error',
}

export interface AppApiInterface {
  authUser(dto: AuthData): Promise<BackendResultByMeta<AuthUserMeta>>;

  getUser(userId: string): Promise<BackendResultByMeta<GetUserMeta>>;

  refreshUser(dto: RefreshUserCommand['attrs']): Promise<BackendResultByMeta<RefreshUserMeta>>;
}

export type AuthData = {
  type: 'widget-login' | 'mini-app-login';
  data: string,
}

export type TelegramUser = {
  id: string;
  first_name: string;
  username?: string;
  photo_url?: string,
  [key: string]: string | number | undefined;
}

export type TelegramWidgetUserData = {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  [key: string]: unknown;
}

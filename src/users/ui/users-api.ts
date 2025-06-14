import type { AuthData, AppApiInterface } from "../../app/ui/base-run/run-types";
import { type BackendResultByMeta } from "rilata/core";
import { type GetUserCommand, type GetUserMeta } from "#app/domain/user/struct/get-user";
import type { GetUsersCommand, GetUsersMeta } from "#app/domain/user/struct/get-users";
import type { EditUserCommand, EditUserMeta } from "#app/domain/user/struct/edit-user";
import type { AuthUserCommand, AuthUserMeta } from "#app/domain/user/struct/auth-user";
import { usersApiUrl } from "#users/constants";
import { jwtDecoder } from "#app/ui/base-run/app-resolves";
import { BaseBackendApi } from "#app/ui/base/base-api";
import type { RefreshUserCommand, RefreshUserMeta } from "#app/domain/user/struct/refresh-user";

class UsersApi extends BaseBackendApi implements AppApiInterface {
  authUser(dto: AuthData): Promise<BackendResultByMeta<AuthUserMeta>> {
    const command: AuthUserCommand = {
      name: 'auth-user',
      attrs: dto,
      requestId: crypto.randomUUID(),
    }
    return this.request<AuthUserMeta>(command);
  }

  refreshUser(attrs: RefreshUserCommand['attrs']): Promise<BackendResultByMeta<RefreshUserMeta>> {
    const command: RefreshUserCommand = {
      name: 'refresh-user',
      attrs,
      requestId: crypto.randomUUID(),
    }
    return this.request<RefreshUserMeta>(command);
  }

  getUser(id: string): Promise<BackendResultByMeta<GetUserMeta>> {
    const command: GetUserCommand = {
      name: 'get-user',
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    return this.request<GetUserMeta>(command);
  }

  getUsers(): Promise<BackendResultByMeta<GetUsersMeta>> {
    const command: GetUsersCommand = {
      name: 'get-users',
      attrs: {},
      requestId: crypto.randomUUID(),
    }
    return this.request<GetUsersMeta>(command);
  }

  editUser(attrs: EditUserCommand['attrs']): Promise<BackendResultByMeta<EditUserMeta>> {
    const command: EditUserCommand = {
      name: 'edit-user',
      attrs,
      requestId: crypto.randomUUID(),
    }
    return this.request<EditUserMeta>(command);
  }
}

export const usersApi = new UsersApi(usersApiUrl, jwtDecoder);

import type { AuthData, AppApiInterface } from "../../app/ui/base-run/run-types";
import { success, type BackendResultByMeta } from "rilata/core";
import { type GetUserCommand, type GetUserMeta } from "#app/domain/user/struct/get-user";
import type { GetUsersCommand, GetUsersMeta } from "#app/domain/user/struct/get-users";
import type { EditUserCommand, EditUserMeta } from "#app/domain/user/struct/edit-user";
import type { AuthUserCommand, AuthUserMeta } from "#app/domain/user/struct/auth-user";
import { usersApiUrl } from "#users/constants";
import { jwtDecoder } from "#app/ui/base-run/app-resolves";
import { BaseBackendApi } from "#app/ui/base/base-api";
import type { RefreshUserCommand, RefreshUserMeta } from "#app/domain/user/struct/refresh-user";
import type { UserAttrs } from "#app/domain/user/struct/attrs";

class UsersApi extends BaseBackendApi<UserAttrs> implements AppApiInterface {
  async authUser(dto: AuthData): Promise<BackendResultByMeta<AuthUserMeta>> {
    const command: AuthUserCommand = {
      name: 'auth-user',
      attrs: dto,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<AuthUserMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(result.value.user.id, result.value.user);
    }
    return result;
  }

  refreshUser(attrs: RefreshUserCommand['attrs']): Promise<BackendResultByMeta<RefreshUserMeta>> {
    const command: RefreshUserCommand = {
      name: 'refresh-user',
      attrs,
      requestId: crypto.randomUUID(),
    }
    return this.request<RefreshUserMeta>(command);
  }

  async getUser(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetUserMeta>> {
    const cached = this.getFromCacheById(id, forceRefresh);
    if (cached) return success(cached);

    const command: GetUserCommand = {
      name: 'get-user',
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetUserMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(result.value.id, result.value);
    }
    return result;
  }

  async getUsers(forceRefresh?: boolean): Promise<BackendResultByMeta<GetUsersMeta>> {
    const cached = this.getFromCacheList(forceRefresh);
    if (cached) return success(cached);

    const command: GetUsersCommand = {
      name: 'get-users',
      attrs: {},
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetUsersMeta>(command);
    if (result.isSuccess()) {
      this.setCacheList(result.value);
      result.value.forEach(u => this.setCacheById(u.id, u));
    }
    return result;
  }

  editUser(attrs: EditUserCommand['attrs']): Promise<BackendResultByMeta<EditUserMeta>> {
    this.removeFromCacheById(attrs.id);
    const command: EditUserCommand = {
      name: 'edit-user',
      attrs,
      requestId: crypto.randomUUID(),
    }
    return this.request<EditUserMeta>(command);
  }
}

export const usersApi = new UsersApi(usersApiUrl, jwtDecoder);

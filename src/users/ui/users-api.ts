import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";
import { type GetUserCommand, type GetUserMeta } from "#users/domain/user/struct/get-user/contract";
import type { GetUsersCommand, GetUsersMeta } from "#users/domain/user/struct/get-users/contract";
import type { EditUserCommand, EditUserMeta } from "#users/domain/user/struct/edit-user/contract";
import type { AuthData, AuthUserCommand, AuthUserMeta } from "#users/domain/user/struct/auth-user/contract";
import type { RefreshUserCommand, RefreshUserMeta } from "#users/domain/user/struct/refresh-user/contract";
import { BaseBackendApi } from "#app/ui/base/base-api";
import type { UserAttrs } from "#users/domain/user/struct/attrs";
import { usersApiUrl } from "#users/constants";
import type { UiUserFacade } from "#users/domain/user/facade";

export class UsersBackendApi extends BaseBackendApi<UserAttrs> implements UiUserFacade {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(usersApiUrl, jwtDecoder, cacheTtlAsMin);
  }

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

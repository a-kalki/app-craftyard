import { BackendApi, localStore } from "rilata/ui";
import { type ResultDTO } from "rilata/core";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../base-run/constants";
import type { RefreshUserCommand, RefreshUserMeta } from "#app/domain/user/struct/refresh-user";

export abstract class BaseBackendApi extends BackendApi {
  protected REFRESH_URL = '/api/users';

  get accessToken(): string | undefined {
    return localStore.get(ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | undefined {
    return localStore.get(REFRESH_TOKEN_KEY);
  }

  protected async updateAccessToken(): Promise<void> {
    const command: RefreshUserCommand = {
      name: 'refresh-user',
      attrs: {
        refreshToken: localStore.get(REFRESH_TOKEN_KEY)!,
      },
      requestId: crypto.randomUUID(),
    }

    try {
      console.log('before refresh token: ', command.attrs);

      const backendResult = await fetch(this.REFRESH_URL, this.getRequestBody(command));
      const resultDto = await backendResult.json() as ResultDTO<
        RefreshUserMeta['errors'], RefreshUserMeta['success']
      >;

      if (resultDto.success) {
        localStore.set(ACCESS_TOKEN_KEY, resultDto.payload.accessToken);
        console.log('after refresh token: ', this.accessToken);
      }
        throw Error('Failed to refresh token');
    } catch (err) {
      alert('Произошла ошибка в приложении, попробуйте перезагрузить страницу');
      console.log('При обновлении access токена произошла ошибка', err);
      throw Error('Не удалось обновить access токен');
    }
  }
 }

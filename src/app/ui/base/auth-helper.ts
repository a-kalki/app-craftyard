import { localStore } from "rilata/ui";
import type { AppState } from "./types";
import type { AuthUserSuccess, TokenType } from "#app/domain/user/struct/auth-user/contract";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../base-run/constants";
import type { BootstrapResolves } from "../base-run/run-types";

export class AuthHelper {
  constructor(
    private resolves: BootstrapResolves,
    private appState: AppState,
  ) {}

  getAppStateBySuccessLogin(loginSuccess: AuthUserSuccess): AppState {
    this.setStore(loginSuccess.tokens);
    return {
      userIsAuth: true,
      user: loginSuccess.user,
      isMobile: this.appState.isMobile,
      isTelegramMiniApp: this.appState.isTelegramMiniApp,
    }
  }

  getAnonimousUserAppState(): AppState {
    this.clearStore();
    return {
      userIsAuth: false,
      isMobile: this.appState.isMobile,
      isTelegramMiniApp: this.appState.isTelegramMiniApp,
    }
  }

  async getUserAppStateByToken(): Promise<AppState | null> {
    const accessTokenInitResult = await this.initByAccessToken();
    if (!accessTokenInitResult) {
      this.clearStore();
      return null;
    };
    if (accessTokenInitResult !== 'access-is-expired') return accessTokenInitResult;

    const refreshToken = localStore.get<string>(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.clearStore();
      return null;
    };

    if (this.resolves.jwtDecoder.dateIsExpired(refreshToken)) {
      this.clearStore();
      return null;
    }

    const refreshResult = await this.resolves.userFacade.refreshUser({ refreshToken });
    if (refreshResult.isFailure()) {
      this.clearStore();
      return null;
    }
    this.setStore({ access: refreshResult.value.accessToken, refresh: refreshToken });

    const repeatAccessTokenInitResult = await this.initByAccessToken();
    if (!repeatAccessTokenInitResult || repeatAccessTokenInitResult === 'access-is-expired') {
      this.clearStore();
      return null;
    };
    return repeatAccessTokenInitResult;
  }

  clearStore(): void {
    localStore.clear();
  }

  private async initByAccessToken(): Promise<AppState | 'access-is-expired' | null> {
    const storedAuthToken = localStore.get<string>(ACCESS_TOKEN_KEY);
    if (!storedAuthToken) return null;

    if (this.resolves.jwtDecoder.dateIsExpired(storedAuthToken)) return 'access-is-expired';

    const payloadResult = this.resolves.jwtDecoder.getTokenPayload(storedAuthToken);
    if (payloadResult.isFailure()) {
      return null;
    }
    const userId = payloadResult.value.id;
    const getResult = await this.resolves.userFacade.getUser(userId);
    if (getResult.isFailure()) {
      return null;
    }
    const appState: AppState = {
      userIsAuth: true,
      user: getResult.value,
      isMobile: this.appState.isMobile,
      isTelegramMiniApp: this.appState.isTelegramMiniApp,
    }
    return appState;
  }

  private setStore(tokens: TokenType): void {
    localStore.set(ACCESS_TOKEN_KEY, tokens.access);
    localStore.set(REFRESH_TOKEN_KEY, tokens.refresh);
  }
}

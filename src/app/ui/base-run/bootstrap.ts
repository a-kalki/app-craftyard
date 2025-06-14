import {} from '../shoelace';
import {} from '../app-components'

import { App } from '../base/app';
import type { AuthData, AppApiInterface } from './run-types';
import type { ModuleManifest } from '../base/types';
import { AppRouter } from '../base/app-router';
import { AppNotifier } from '../base/app-notifier';
import { localStore } from 'rilata/ui';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';
import type { UserAttrs } from '#app/domain/user/user';
import type { AuthUserSuccess, TokenType } from '#app/domain/user/struct/auth-user';
import { jwtDecoder } from './app-resolves';

export class Bootstrap {
  protected  appRouter = new AppRouter();

  protected appNotifier = new AppNotifier();

  protected isTelegramMiniApp = false;

  constructor(
    protected manifests: ModuleManifest[],
    protected appApi: AppApiInterface,
  ) {}

  protected async processStoredAuthToken(accessToken: string): Promise<void> {
    const refreshToken = localStore.get<string>(REFRESH_TOKEN_KEY);
    if (jwtDecoder.dateIsExpired(accessToken) === false) {
      const payloadResult = jwtDecoder.getTokenPayload(accessToken);
      if (payloadResult.isFailure()) {
        this.showLoginPage();
        return;
      }
      const userId = payloadResult.value.userId;
      const getResult = await this.appApi.getUser(userId);
      if (getResult.isFailure()) {
        this.showLoginPage();
        return;
      }
      this.showAppPage(getResult.value, {
        access: accessToken,
        refresh: refreshToken ?? '',
      });
      return;
    }

    if (!refreshToken || jwtDecoder.dateIsExpired(refreshToken)) {
      this.showLoginPage();
      return;
    }
    const refreshResult = await this.appApi.refreshUser({ refreshToken });
    if (refreshResult.isFailure()) {
      this.showLoginPage();
      return;
    }
    const refreshedAccessToken = refreshResult.value.accessToken;
    const payloadResult = jwtDecoder.getTokenPayload(refreshedAccessToken);
    if (payloadResult.isFailure()) {
      this.showLoginPage();
      return;
    }
    const { userId } = payloadResult.value;
    const getResult = await this.appApi.getUser(userId);
    if (getResult.isFailure()) {
      this.showLoginPage();
      return;
    }
    this.showAppPage(getResult.value, {
      access: refreshedAccessToken,
      refresh: refreshToken,
    });
  }

  async start() {
    try {
      this.appRunSubscribes();
      this.prepareBody();
      this.isTelegramMiniApp = await this.initTelegramWebApp();

      const storedAuthToken = localStore.get<string>(ACCESS_TOKEN_KEY);
      if (storedAuthToken) {
        this.processStoredAuthToken(storedAuthToken);
      } else if(this.isTelegramMiniApp) {
        const data: AuthData = {
          type: 'mini-app-login',
          data: this.getTelegramInitData(),
        }
        const authResult = await this.appApi.authUser(data);
        if (authResult.isFailure()) {
          this.appNotifier.error('Произошла ошибка при авторизации. Попробуйте перезагрузить страницу.', {
            result: authResult,
            commandData: data,
          });
          return;
        } 
        const { user, token } = authResult.value;
        this.showAppPage(user, token);
      } else {
        this.showLoginPage();
      }
    } catch (err) {
      console.error('Ошибка:', err);
      alert('<p>Ошибка загрузки. Попробуйте обновить страницу.</p>');
      throw err;
    }
  }

  protected async initTelegramWebApp(): Promise<boolean> {
    // 1. Проверяем, находимся ли мы в Telegram WebView
    if (!this.isTelegramWebView()) {
      return false;
    }

    // 2. Загружаем скрипт API
    try {
      await this.loadTelegramScript();
      
      // 3. Проверяем доступность API
      if (!window.Telegram?.WebApp) {
        return false;
      }

      // 4. Инициализируем WebApp
      const { WebApp } = window.Telegram;
      WebApp.ready();
      WebApp.expand();
      
      return true;

    } catch (error) {
      return false;
    }
  }

  private isTelegramWebView(): boolean {
    return /telegram|webapp/i.test(navigator.userAgent) || 
           new URLSearchParams(window.location.search).has('tgWebAppPlatform');
  }

  private loadTelegramScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Не удалось загрузить скрипт'));
      document.head.appendChild(script);
    });
  }

  protected getTelegramInitData(): string {
    const initData = window.Telegram?.WebApp?.initData;
    this.appNotifier.info('Ваш Telegram data: ', {
      details: {
        initData: window.Telegram?.WebApp?.initData,
        initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe
      }
    });
    if (!initData) {
      const err = new Error('Telegram init data not found');
      this.appNotifier.error('Непредвиденная ошибка. Перезапустите приложение.', err);
      throw err;
    };
    return initData;
  }

  protected appRunSubscribes(): void {
    window.addEventListener('app-logout', () => this.showLoginPage());
    window.addEventListener('user-logined', this.loginListener)
  }

  protected loginListener = (e: Event) => {
    const { user, token } = (e as CustomEvent<AuthUserSuccess>).detail;
    this.appRouter.navigate('/my-profile');
    this.showAppPage(user, token);
  }

  protected showLoginPage(): void {
    localStore.clear();
    this.appRouter.navigate('/login');
    const root = this.prepareBody();

    const page = document.createElement('login-page');
    (page as any).usersApi = this.appApi;
    root.appendChild(page);
  }

  protected showAppPage(user: UserAttrs, token: TokenType): void {
      localStore.set(ACCESS_TOKEN_KEY, token.access);
      localStore.set(REFRESH_TOKEN_KEY, token.refresh);
      const app = new App(this.appApi, this.manifests, user, this.isTelegramMiniApp);
      app.init();
      this.redirectStartApp(app);

      const root = this.prepareBody();
      const appPage = document.createElement('app-page');
      root.appendChild(appPage);
  }

  protected redirectStartApp(app: App): void {
      const path = app.router.getPath();
      const isLoginPath = path.startsWith('/login');
      const isRegistrationPath = path.startsWith('/register');
      const isHomePath = ['/home', '', '/'].includes(path);
      if (isLoginPath || isRegistrationPath || isHomePath) {
        app.router.navigate('/my-profile')
      }
  }

  protected prepareBody(): HTMLDivElement {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root not found');
    root.innerHTML = '';

    const appDialog = document.createElement('sl-dialog');
    appDialog.id = 'app-dialog';
    document.body.appendChild(appDialog);

    const appToaster = document.createElement('app-toaster');
    appToaster.id = 'app-toaster';
    root.appendChild(appToaster);

    return root as HTMLDivElement;
  }
}

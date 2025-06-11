import {} from '../shoelace';
import {} from '../app-components'

import { App } from '../base/app';
import { authUserId, localStore } from '../base/localstorage';
import type { TelegramAuthUser, TelegramUser, UserApiInterface } from './run-types';
import type { UserDod } from '../../app-domain/dod';
import type { ModuleManifest } from '../base/types';
import { AppRouter } from '../base/app-router';
import { AppNotifier } from '../base/app-notifier';

export class Bootstrap {
  protected  appRouter = new AppRouter();

  protected appNotifier = new AppNotifier();

  protected isTelegramMiniApp = false;

  constructor(protected manifests: ModuleManifest[], protected usersApi: UserApiInterface) {}

  async start() {
    try {
      this.appRunSubscribes();
      this.prepareBody();
      this.isTelegramMiniApp = await this.initTelegramWebApp();

      let storedUserId: string | undefined = localStore.get<string>(authUserId);
      if (storedUserId) {
        const result = storedUserId ? (await this.usersApi.findUser(storedUserId)) : undefined
        if (result && result.status) {
          this.showAppPage(result.success);
          return;
        } else {
          localStore.clear();
        }
      } else if(this.isTelegramMiniApp) {
        const tgUser = this.getUserFromTelegram();
        const result = await this.usersApi.findUser(tgUser.id.toString());
        if (!result.status) {
          this.showRegistrationPage(tgUser);
        } else {
          this.showAppPage(result.success);
        }
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

  protected getUserFromTelegram(): TelegramUser {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      const err = new Error('Telegram user not found');
      this.appNotifier.error('Непредвиденная ошибка. Убедитесь что запускаете внутри Telegram.', err);
      throw err;
    };
    return tgUser;
  }

  protected appRunSubscribes(): void {
    window.addEventListener('app-logout', () => this.showLoginPage());
    window.addEventListener('user-logined', this.loginListener)
    window.addEventListener('need-registration', this.registrationListener)
  }

  protected loginListener = (e: Event) => {
    console.log('Login listener', e);
    localStore.clear();
    const user = (e as CustomEvent<UserDod>).detail;
    this.appRouter.navigate('/my-profile');
    this.showAppPage(user);
  }

  protected registrationListener = (e: Event) => {
    const tgUser = (e as CustomEvent<TelegramAuthUser>).detail;
    this.showRegistrationPage(tgUser);
  }

  protected showLoginPage(): void {
    this.appRouter.navigate('/login');
    const root = this.prepareBody();

    const page = document.createElement('login-page');
    (page as any).usersApi = this.usersApi;
    root.appendChild(page);
  }

  protected showRegistrationPage(tgUser: TelegramUser): void {
    this.appRouter.navigate(`/register?t=${tgUser.id}`);
    const root = this.prepareBody();

    const page = document.createElement('registration-page');
    (page as any).telegramId = tgUser.id.toString();
    (page as any).telegramName = tgUser.first_name;
    (page as any).telegramNickname = tgUser.username ?? '';
    (page as any).avatarUrl = tgUser.photo_url;
    (page as any).usersApi = this.usersApi;

    root.appendChild(page);
  }

  protected showAppPage(user: UserDod): void {
      localStore.set(authUserId, user.id);
      const app = new App(this.manifests, user, this.isTelegramMiniApp);
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

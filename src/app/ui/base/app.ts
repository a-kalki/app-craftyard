import type { AppCurrentUserInfo, AppState, AppUserWorkshopInfo, RouteRedirect, SidebarItem, ToastVariant } from "./types";
import { AppRouter } from "./app-router";
import type { Module } from "./module";
import { AppNotifier } from "./app-notifier";
import { AppDialog, type DialogOptions } from "./app-dialog";
import type { UserAttrs } from "#app/domain/user/struct/attrs";
import type { BootstrapResolves } from "../base-run/run-types";
import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";
import type { AuthUserSuccess } from "#app/domain/user/struct/auth-user/contract";
import { AuthHelper } from "./auth-helper";
import { workshopUrl } from "#workshop/constants";

export class App {
  public router = new AppRouter();

  protected _appState: AppState = {
    userIsAuth: false,
    isTelegramMiniApp: false,
    isMobile: false,
  };

  private appNotifier = new AppNotifier();
  private appDialog = new AppDialog();
  private resolves!: BootstrapResolves;
  
  private urlAfterLogin!: string;
  private resizeObserver!: ResizeObserver;

  constructor(protected modules: Module[]) {}

  public async init(resolves: BootstrapResolves, isTelegramMiniApp: boolean): Promise<void> {
    this.resolves = resolves;

    this._appState.isTelegramMiniApp = isTelegramMiniApp;
    this._appState.isMobile = window.innerWidth < 768;

    this.setUrlAfterLogin();
    await this.initAppState(); 
    this.initAppEventListeners(); 
    (window as any).app = this; 
    this.initResizeObserver();

    this.registerRoutableComponents();
    this.registerRedirects();
    this.router.init();
    
    this.modules.forEach(m => m.init(this));

    this.orchestrateMainPageDisplay();
  }

  // пока работаем с копией,
  // в будущем если захотим реактивности, то придется рефайторить
  get appState(): AppState {
    return { ...this._appState }; 
  }

  get userInfo(): AppCurrentUserInfo {
    return this._appState.userIsAuth
      ? {
          isAuth: true,
          user: { ...this._appState.user },
        }
      : { isAuth: false }
  }

  /** Возвращает привязанную к текущему пользователю мастерскую */
  get userWorkshopInfo(): AppUserWorkshopInfo {
    // пока работаем с глобальным скоуп, до решения архитектуры внедрения или контекста
    return this.userInfo.isAuth && ((window as any).userWorkshop)
      ? {
        isBind: true,
        user: this.userInfo.user,
        workshop: { ...(window as any).userWorkshop },
      }
      : { isBind: false };
  }

  /**
   * Возвращает текущего пользователя.
   * Используется когда по контексту понятно что пользователь авторизован.
   */
  assertAuthUser(): UserAttrs {
    if (!this.userInfo.isAuth) {
      this.error('Необходимо авторизоваться.');
      throw new Error('Authentication required.'); // Всегда выбрасываем ошибку, если не авторизован
    }
    return this.userInfo.user;
  }

  /**
   * Возвращает мастерскую текущего пользователя.
   * Используется когда по контексту понятно что пользователь
   * привязал свой аккаунт к определенной мастерской.
   */
  assertUserWorkshop(): WorkshopAttrs {
    this.assertAuthUser();
    if (!this.userWorkshopInfo.isBind) {
      this.error('Необходимо привязать свой аккаунт к мастерской.');
      throw new Error('Need bind user to workshop.'); // Всегда выбрасываем ошибку, если не привязан
    }
    return this.userWorkshopInfo.workshop;
  }

  showLogin(afterLoginedUrl?: string): void {
    console.log('ff', this.appState);
    if (this.appState.isTelegramMiniApp) {
      this.error(
        `[${this.constructor.name}]: Нельзя показать страницу авторизации в telegram mini app.`,
      );
      return;
    }

    this.setUrlAfterLogin(afterLoginedUrl);
    const authHelper = this.getAuthHelper();
    authHelper.clearStore();
    this._appState = authHelper.getAnonimousUserAppState();
    this.router.navigate('/login');
    this.orchestrateMainPageDisplay();
  }

  logout(): void {
    if (this.appState.isTelegramMiniApp) {
      this.error(
        `[${this.constructor.name}]: Нельзя выйти из аккаунта в telegram mini app.`,
      );
      return;
    }
    this.setUrlAfterLogin();

    const authHelper = this.getAuthHelper();
    authHelper.clearStore(); 
    this._appState = authHelper.getAnonimousUserAppState();
    this.router.navigate('/login');
    this.orchestrateMainPageDisplay();
  }

  showDialog(options: DialogOptions): Promise<boolean> {
    return this.appDialog.show(options);
  }

  info(text: string, options: { variant?: ToastVariant; details?: unknown } = {}) {
    this.appNotifier.info(text, options);
  }

  error(text: string, details?: unknown) {
    this.appNotifier.error(text, details);
  }

  getRootItems(): SidebarItem[] {
    return this.modules.flatMap(m => m.rootItems);
  }

  private setUrlAfterLogin(url?: string): void {
    if (url) {
      this.urlAfterLogin = url;
    } else {
      this.urlAfterLogin = this._appState.userIsAuth ? '/my-profile' : workshopUrl;
    }
  }

  private registerRedirects(): void {
    this.router.clearRedirects()
    this.modules.forEach(m => {
      if (m.redirects) {
        m.redirects.forEach(r => {
          if (r.to === '/default') {
            const defaultHomeUrl = this._appState.userIsAuth ? '/my-profile' : workshopUrl;
            const defaultRedirect: RouteRedirect = {
              from: r.from,
              to: defaultHomeUrl,
            }
            this.router.registerRedirect(defaultRedirect);
          } else {
            this.router.registerRedirect(r)
          }
        });
      }
    });
  }

  private registerRoutableComponents(): void {
    this.modules.forEach(m => {
      m.routableTags.forEach(rt => {
        this.router.registerRoutableElement(rt);
      });
    });
  }

  /**
   * Инициализирует appState
   */
  private async initAppState(): Promise<void> {
    const authHelper = this.getAuthHelper();

    const appStateByToken = await authHelper.getUserAppStateByToken();
    if (appStateByToken) {
      this._appState = appStateByToken;
      return;
    }
    
    // Если по токенам не удалось и это Telegram Mini App, пробуем через initData
    if (this._appState.isTelegramMiniApp) {
      try {
        const initData = this.getTelegramInitData();
        const authResult = await this.resolves.userFacade.authUser({
          type: 'mini-app-login',
          data: initData,
        });

        if (authResult.isSuccess()) {
          this._appState = authHelper.getAppStateBySuccessLogin(authResult.value);
        } else {
          this.error('Произошла ошибка при авторизации в Telegram Mini App. Возможно, данные устарели.', {
            result: authResult.value,
          });
          this._appState = authHelper.getAnonimousUserAppState();
        }
      } catch (err) {
        this.error('Критическая ошибка при авторизации через Telegram Mini App. Перезапустите приложение.', err);
        this._appState = authHelper.getAnonimousUserAppState();
      }
    } else {
      this._appState = authHelper.getAnonimousUserAppState();
    }
  }

  /** Метод для получения Telegram Init Data */
  private getTelegramInitData(): string {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      const err = new Error('Telegram init data not found or invalid.');
      this.error('Непредвиденная ошибка. Перезапустите приложение.', {
        initData, err,
      });
      throw err;
    };
    return initData;
  }

  private initAppEventListeners(): void {
    window.addEventListener('user-logined', this.handleUserLogined);
  }

  /** Обработчик события 'user-logined' */
  private handleUserLogined = (e: Event) => {
    const successData = (e as CustomEvent<AuthUserSuccess>).detail;
    const authHelper = this.getAuthHelper();
    this._appState = authHelper.getAppStateBySuccessLogin(successData); 
    this.router.navigate(this.urlAfterLogin);
    this.orchestrateMainPageDisplay();
  }

  /**
   * Оркестрирует отображением основной страницы (app-page или login-page).
   */
  private orchestrateMainPageDisplay(): void {
    const currentPath = this.router.getPath();
    const isLoginPath = currentPath.startsWith('/login');

    if (this.appState.userIsAuth) {
      this.showAppPage();
      if (isLoginPath) this.router.navigate(this.urlAfterLogin);
    } else if (currentPath.startsWith('/login')) {
      this.showLoginPage();
    } else {
      this.showAppPage();
    }
  }

  private showLoginPage(): void {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      this.error('Не удалось загрузить приложение, не найден root. Попробуйте перезагрузить.');
      throw Error('element by id="root" not founded');
    }
    rootElement.innerHTML = '';
    const loginPage = document.createElement('login-page');
    rootElement.appendChild(loginPage);
  }

  private showAppPage(): void {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      this.error(`[${this.constructor.name}]: Не удалось найти элемент root.`);
      throw Error('element by id="root" not founded');
    }
    rootElement.innerHTML = '';
    const appPage = document.createElement('app-page');
    rootElement.appendChild(appPage);
  }

  private getAuthHelper(): AuthHelper {
    // генерируем каждый раз, чтобы получать текущее состояние _appState
    return new AuthHelper(this.resolves, this._appState);
  }

  private initResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const isMobile = width < 768;
        if (this._appState.isMobile !== isMobile) {
          this._appState.isMobile = isMobile; // Обновляем внутреннее состояние
          window.dispatchEvent(new CustomEvent<{isMobile: boolean}>(
            'app-is-mobile-changed',
            { detail: { isMobile } }
          ));
        }
      }
    });
    this.resizeObserver.observe(document.body);
  }
}

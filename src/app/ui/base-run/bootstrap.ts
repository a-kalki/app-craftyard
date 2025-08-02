import {} from '../shoelace';
import {} from '../app-components';

import { App } from '../base/app';
import type { Module } from '../base/module';
import type { BootstrapResolves } from './run-types';

export class Bootstrap {
  private appInstance: App | null = null;

  constructor(
    protected modules: Module[],
    protected resolves: BootstrapResolves,
  ) {}

  public async start(): Promise<void> {
    try {
      // 1. Готовим тело html
      this.prepareBody();

      // 2. Определяем, является ли это Telegram Mini App
      //const isTelegramMiniApp = await this.initTelegramWebApp();
      const isTelegramMiniApp = false;

      // 3. Создаем экземпляр App и инициализируем его
      this.appInstance = new App(this.modules);
      await this.appInstance.init(this.resolves, isTelegramMiniApp);

      // 4. Bootstrap завершает свою работу

    } catch (err) {
      console.error('Критическая ошибка при запуске Bootstrap:', err);
      alert('<p>Критическая ошибка загрузки приложения. Попробуйте обновить страницу.</p>');
      throw err;
    }
  }

  // TODO: чето не работет, пока пропустим...
  private async initTelegramWebApp(): Promise<boolean> {
    try {
      await this.loadTelegramScript();

      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Проверяем, находимся ли мы в Telegram WebView
      if (!this.isTelegramWebView()) {
        return false;
      }
      
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
      console.warn('Не удалось инициализировать Telegram WebApp:', error);
      return false;
    }
  }

  private isTelegramWebView(): boolean {
    // 1. Проверка по window.Telegram (если скрипт уже загружен)
    if (window.Telegram?.WebApp) return true;

    // 2. Проверка по специальным параметрам в URL
    const params = new URLSearchParams(window.location.search);
    const hasTgParams = ['tgWebAppPlatform', 'tgWebAppVersion'].some(p => params.has(p));
    if (hasTgParams) return true;

    // 3. Проверка по window.initData (Telegram WebApp всегда передает initData)
    if (window.Telegram?.WebApp?.initData || window.Telegram?.WebApp?.initDataUnsafe) {
      return true;
    }

    // 4. Проверка по document.referrer (для некоторых случаев)
    if (document.referrer.includes('telegram.org') || document.referrer.includes('t.me')) {
      return true;
    }

    // 5. Проверка по наличию Viewport мета-тега (Telegram WebView добавляет свой)
    const viewportMeta = document.querySelector('meta[name="viewport"][content*="telegram"]');
    if (viewportMeta) return true;

    return false;
  }

  private loadTelegramScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Не удалось загрузить скрипт Telegram WebApp.'));
      document.head.appendChild(script);
    });
  }

  private prepareBody(): void {
    const root = document.getElementById('root');
    if (!root) throw new Error('Root-элемент с id "root" не найден в DOM.');
    root.innerHTML = '';

    const appDialog = document.createElement('sl-dialog');
    appDialog.id = 'app-dialog'; 
    document.body.appendChild(appDialog);

    const appToaster = document.createElement('app-toaster');
    appToaster.id = 'app-toaster'; 
    document.body.appendChild(appToaster);
  }
}

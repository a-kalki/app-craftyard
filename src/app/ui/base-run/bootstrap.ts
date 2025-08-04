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
      const isTelegramMiniApp = await this.initTelegramWebApp();

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
    return !!window.Telegram?.WebApp?.initData
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

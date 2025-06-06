import type { App } from '../app/ui/app/app';

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
    onTelegramAuth: (user: TelegramAuthUser) => void;
  }

  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: any;
    platform: string;
    version: string;
    isExpanded: boolean;
    expand(): void;
    close(): void;
    ready(): void;
    showDebug(flag: boolean): void;
    sendData(data: string): void;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
    MainButton: {
      text: string;
      isVisible: boolean;
      show(): void;
      hide(): void;
      onClick(callback: () => void): void;
    };
    // Можно расширять по мере необходимости
  }
}

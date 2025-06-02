import type { RouteListener, UrlParams } from "./types";

export class AppRouter {
  private listeners: RouteListener[] = [];
  private matchers: { pattern: string; matcher: (url: string) => UrlParams | null }[] = [];

  constructor() {
    window.addEventListener('popstate', this.handlePopState);
  }

  // Навигация
  navigate(path: string) {
    history.pushState({}, '', path);
    this.notify();
  }

  // Подписка на изменения url
  subscribe(listener: RouteListener) {
    this.listeners.push(listener);
    listener(this.getPath(), this.getParams());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Регистрация шаблонов путей для парсинга параметров
  registerPattern(pattern: string) {
    const keys: string[] = [];
    const regex = new RegExp(
      '^' +
        pattern.replace(/\/:([^\/]+)/g, (_, key) => {
          keys.push(key);
          return '/([^/]+)';
        }) +
        '$'
    );

    const matcher = (url: string): UrlParams | null => {
      const match = url.match(regex);
      if (!match) return null;
      const values = match.slice(1);
      const params: UrlParams = {};
      keys.forEach((k, i) => (params[k] = decodeURIComponent(values[i])));
      return params;
    };

    this.matchers.push({ pattern, matcher });
  }

  // Получение текущего пути
  getPath() {
    return window.location.pathname;
  }

  // Получение параметров текущего пути
  getParams(): UrlParams {
    for (const { matcher } of this.matchers) {
      const result = matcher(this.getPath());
      if (result) return result;
    }
    return {};
  }

  // Уничтожение (например, при hot reload)
  destroy() {
    window.removeEventListener('popstate', this.handlePopState);
    this.listeners = [];
  }

  // Внутренние методы
  private handlePopState = () => this.notify();

  private notify() {
    const path = this.getPath();
    const params = this.getParams();
    this.listeners.forEach(listener => listener(path, params));
  }
}


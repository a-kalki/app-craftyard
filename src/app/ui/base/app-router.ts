import type { RoutableCustomComponent, RouteRedirect, UrlParams } from "./types";

type RoutableElementEntry = {
  matcher: (url: string) => UrlParams | undefined
} & RoutableCustomComponent

export class AppRouter {
  private listeners: (() => void)[] = [];
  private entries: RoutableElementEntry[] = [];
  private redirects: RouteRedirect[] = [];

  constructor() {
    window.addEventListener('popstate', () => this.notify());
  }

  init(): void {
    this.initRedirect();
  }

  // Навигация
  navigate(path: string) {
    const resolved = this.resolveRedirect(path);
    history.pushState({}, '', resolved);
    this.notify();
  }

  // Подписка на изменения url
  subscribe(listener: () => void) {
    this.listeners.push(listener);
    listener();
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Регистрация шаблонов путей для парсинга параметров
  registerRoutableElement(attrs: RoutableCustomComponent): void {
    const keys: string[] = [];
    const regex = new RegExp(
      '^' +
        attrs.pattern.replace(/\/:([^\/]+)/g, (_, key) => {
          keys.push(key);
          return '/([^/]+)';
        }) +
        '$'
    );

    const matcher = (url: string): UrlParams | undefined => {
      const match = url.match(regex);
      if (!match) return;
      const values = match.slice(1);
      const params: UrlParams = {};
      keys.forEach((k, i) => (params[k] = decodeURIComponent(values[i])));
      return params;
    };

    this.entries.push({ ...attrs, matcher });
  }

  registerRedirect(redirect: RouteRedirect) {
    this.redirects.push(redirect);
  }

  clearRedirects(): void {
    this.redirects = [];
  }

  // Получение текущего пути
  getPath() {
    return this.removeTrailingSlash(window.location.pathname);
  }

  getHost() {
    const { protocol, hostname, port } = window.location;
    
    if (port) {
      return `${protocol}//${hostname}:${port}`;
    }
    
    return `${protocol}//${hostname}`;
  }

  // Получение параметров текущего пути
  getParams(): UrlParams {
    const entry = this.getEntry();
    return entry ? entry.matcher(this.getPath()) as UrlParams : {};
  }

  getEntry(): RoutableElementEntry | null {
    const path = this.getPath();
    for (const entry of this.entries) {
      const result = entry.matcher(path);
      if (result) return entry;
    }
    throw Error('Routing component not found: ' + path);
  }

  // Уничтожение (например, при hot reload)
  destroy() {
    window.removeEventListener('popstate', this.notify);
    this.listeners = [];
  }

  private resolveRedirect(path: string): string {
    const clean = this.removeTrailingSlash(path);
    for (const { from, to } of this.redirects) {
      if (clean === this.removeTrailingSlash(from)) {
        return this.removeTrailingSlash(to);
      }
    }
    return clean;
  }

  private initRedirect(): void {
    const current = this.getPath();
    const redirected = this.resolveRedirect(current);

    if (current !== redirected) {
      this.navigate(redirected);
    }
  }

  private removeTrailingSlash(path: string): string {
    return path.endsWith('/') ? path.slice(0, -1) : path;
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}


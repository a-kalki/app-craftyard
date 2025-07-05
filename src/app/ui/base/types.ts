import type { UserAttrs } from "#app/domain/user/struct/attrs";

export type AppState = {
  currentUser: UserAttrs,
  isMobile: boolean,
  isTelegramMiniApp: boolean,
}

export type RoutableCustomComponent = {
  pattern: string,
  tag: string,
  type: 'wc',
}

export type UrlParams = Record<string, string>;

export type RouteRedirect = {
  from: string, // '/home'
  to: string, // '/my-profile'
}

export type SidebarItem = {
  name: string;
  url: string;
  title: string;
  icon: string;
  children?: SidebarItem[];
};

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export type ToastMessage = {
  id: number;
  text: string;
  variant: ToastVariant;
  details?: unknown;
}

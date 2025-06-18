import type { UserAttrs } from "#app/domain/user/struct/attrs";

export type AppState = {
  currentUser: UserAttrs,
  isMobile: boolean,
  isTelegramMiniApp: boolean,
}

export type RoutableTags = {
  pattern: string,
  tag: string,
}

export type UrlParams = Record<string, string>;

export type RouteRedirect = {
  from: string, // этот атрибут используется как роутинг, поэтому слеш нужен '/home'
  to: string, // этот атрибут используется как роутинг, поэтому слеш нужен '/my-profile'
}

export type RoutableElementEntry = {
  matcher: (url: string) => UrlParams | undefined
} & RoutableTags

export type RootItem = {
  name: string;
  url: string;
  title: string;
  icon: string
}

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export type ToastMessage = {
  id: number;
  text: string;
  variant: ToastVariant;
  details?: unknown;
}

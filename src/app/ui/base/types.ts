import type { UserDod } from "../../app-domain/dod";

export type AppState = {
  currentUser: UserDod,
  isMobile: boolean,
}

export type UrlParams = Record<string, string>;

export type RoutableElementAttrs = {
  pattern: string,
  tag: string,
}

export type RouteRedirect = {
  from: string,
  to: string,
}

export type RoutableElementEntry = {
  matcher: (url: string) => UrlParams | undefined
} & RoutableElementAttrs

export type RootItem = {
  name: string;
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

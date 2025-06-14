import type { UserAttrs } from "#app/domain/user/user";
import type { BaseElement } from "./base-element";
import type { Module } from "./module";

export type AppState = {
  currentUser: UserAttrs,
  isMobile: boolean,
  isTelegramMiniApp: boolean,
}

export type ModuleManifest = {
  module: Module,
  componentCtors: (typeof BaseElement)[];
}

export type UrlParams = Record<string, string>;

export type RoutableElementAttrs = {
  pattern: string,
  tag: string,
}

export type RouteRedirect = {
  from: string, // этот атрибут используется как роутинг, поэтому слеш нужен '/home'
  to: string, // этот атрибут используется как роутинг, поэтому слеш нужен '/my-profile'
}

export type RoutableElementEntry = {
  matcher: (url: string) => UrlParams | undefined
} & RoutableElementAttrs

export type RootItem = {
  name: string; // этот атрибут используется как имя, слеш не нужен 'users'
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

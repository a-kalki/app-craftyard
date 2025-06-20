import type { UserAttrs } from "#app/domain/user/struct/attrs";
import type { ComponentType } from "svelte";

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

export type LoadableSvelteComponent =
  ComponentType
  | { loader: () => Promise<{ default: ComponentType }> }

export type RoutableSvelteComponent = {
  pattern: string,
  tag: string,
  component: LoadableSvelteComponent
  type: 'svelte';
}

export type RoutableComponent = RoutableCustomComponent | RoutableSvelteComponent;

export type UrlParams = Record<string, string>;

export type RouteRedirect = {
  from: string, // '/home'
  to: string, // '/my-profile'
}

export type RoutableElementEntry = {
  matcher: (url: string) => UrlParams | undefined
} & RoutableComponent

export type SidebarItem = {
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

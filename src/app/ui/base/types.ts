import type { UserAttrs } from "#app/domain/user/struct/attrs";
import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";

export type AppState = {
  userIsAuth: false,
  isMobile: boolean,
  isTelegramMiniApp: boolean,
} | {
  userIsAuth: true,
  user: UserAttrs,
  isMobile: boolean,
  isTelegramMiniApp: boolean,
}

export type RoutableCustomComponent = {
  pattern: string,
  tag: string,
  type: 'wc',
}

type UserAuthentificated = {
  isAuth: true;
  user: UserAttrs;
}

export type AppCurrentUserInfo = UserAuthentificated | { isAuth: false };

type UserWorkshopBinded = {
  isBind: true;
  workshop: WorkshopAttrs;
  user: UserAuthentificated['user']
}

export type AppUserWorkshopInfo = UserWorkshopBinded | { isBind: false }

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

export type ToastVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export type ToastMessage = {
  id: number;
  text: string;
  variant: ToastVariant;
  details?: unknown;
}

export type ValidationResult = {
  isValid: false;
  errors: string[];
} | {
  isValid: true;
  errors?: undefined,
};

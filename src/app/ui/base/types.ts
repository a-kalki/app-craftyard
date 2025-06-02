import type { UserDod } from "../../domain/user/dod";

export type AppState = {
  currentUser: UserDod,
  isMobile: boolean,
}

export type UrlParams = Record<string, string>;

export type RouteListener = (path: string, params: UrlParams) => void;

export type ModuleState = {
  currentUser: UserDod;
  isMobile: boolean;
}

export type RootItem = {
  root: string;
  title: string;
  urlPatterns: string[];
}

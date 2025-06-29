import { Module } from "../../app/ui/base/module";
import type { SidebarItem, RouteRedirect, RoutableCustomComponent } from "../../app/ui/base/types";

import {} from './components';

const routeItems: SidebarItem[] = [];

const routableTags: RoutableCustomComponent[] = []

const routeRedirects: RouteRedirect[] = []

/**
  Данный модуль предоставляет функционал в котором пользователь
  может вносить информацию в своей ствруктуре через mardown.
*/
export const userContentModule = new Module(
  'User Content Module',
  'Модуль данных вносимых пользователем',
  routeItems,
  routableTags,
  routeRedirects
);

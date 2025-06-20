import type { SidebarItem, RoutableComponent, RouteRedirect } from "#app/ui/base/types";
import { Module } from "../../app/ui/base/module";

import {} from './components';

const routeItems: SidebarItem[] = [];

const routableTags: RoutableComponent[] = []

const routeRedirects: RouteRedirect[] = []

export const filesModule = new Module(
  'File Store Module',
  'Модуль Файлов',
  routeItems,
  routableTags,
  routeRedirects
);

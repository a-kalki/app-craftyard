import { Module } from "../../app/ui/base/module";

import {} from './components';
import type { RoutableCustomComponent, RouteRedirect, SidebarItem } from '../../app/ui/base/types';

const routeItems: SidebarItem[] = [];

const routableTags: RoutableCustomComponent[] = []

const routeRedirects: RouteRedirect[] = []

export const cooperationsModule = new Module(
  'Cooperations Module',
  'Модуль Кооперации',
  routeItems,
  routableTags,
  routeRedirects
);

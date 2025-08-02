import type { SidebarItem, RouteRedirect, RoutableCustomComponent } from "#app/ui/base/types";
import { Module } from "../../app/ui/base/module";

import {} from './components';

const routeItems: SidebarItem[] = [
  {
    name: 'app-about',
    title: 'О проекте',
    url: '/about',
    icon: 'info-square',
  }
];

const routableTags: RoutableCustomComponent[] = [
  {
    tag: 'about-app',
    pattern: '/about',
    type: 'wc',
  }
];

const routeRedirects: RouteRedirect[] = []

export const aboutModule = new Module(
  'App About Module',
  'Модуль О Проекта',
  routeItems,
  routableTags,
  routeRedirects
);

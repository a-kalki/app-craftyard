import { Module } from "../../app/ui/base/module";
import type { SidebarItem, RoutableComponent, RouteRedirect } from "../../app/ui/base/types";

import {} from './components';

const routeItems: SidebarItem[] = [
  {
    name: 'workshop',
    url: '/workshops/4e82828c-43c9-4fb5-9716-e31b03103c29',
    title: 'Мастерская',
    icon: 'gear-wide-connected'
  },
];

const routableTags: RoutableComponent[] = [
  {
    pattern: '/workshops/:workshopId',
    tag: 'workshop-details',
    type: 'wc',
  },
]

const routeRedirects: RouteRedirect[] = []

export const workshopsModule = new Module(
  'Workshop Module',
  'Модуль Мастерской',
  routeItems,
  routableTags,
  routeRedirects
);

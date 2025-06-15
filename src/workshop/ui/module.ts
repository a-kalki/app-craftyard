import { Module } from "../../app/ui/base/module";
import type { RootItem, RouteRedirect } from "../../app/ui/base/types";

const routeItems: RootItem[] = [
  {
    name: 'workshop',
    url: '/workshops/4e82828c-43c9-4fb5-9716-e31b03103c29',
    title: 'Мастерская',
    icon: 'gear-wide-connected'
  },
];

// иконки для других модулей
// products	box
// courses	journal-text
// workshops	build

const routeRedirects: RouteRedirect[] = []

export const workshopsModule = new Module('Workshop Module', 'Модуль Мастерской', routeItems, routeRedirects);

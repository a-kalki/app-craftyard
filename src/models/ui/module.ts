import type { RootItem, RouteRedirect } from "#app/ui/base/types";
import { Module } from "../../app/ui/base/module";

const routeItems: RootItem[] = [
  {
    name: 'models',
    url: '/models',
    title: 'Модели',
    icon: 'postcard'
  },
];

const routeRedirects: RouteRedirect[] = []

export const modelsModule = new Module('Models Module', 'Модуль Моделей', routeItems, routeRedirects);

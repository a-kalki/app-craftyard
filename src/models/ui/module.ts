import type { RootItem, RoutableTags, RouteRedirect } from "#app/ui/base/types";
import { Module } from "../../app/ui/base/module";

import {} from './components';

const routeItems: RootItem[] = [
  {
    name: 'models',
    url: '/models',
    title: 'Модели',
    icon: 'postcard'
  },
];

const routableTags: RoutableTags[] = [
  {
    pattern: '/models',
    tag: 'models-list',
  },
  {
    pattern: '/models/:modelId',
    tag: 'model-details',
  },
]

const routeRedirects: RouteRedirect[] = []

export const modelsModule = new Module(
  'Models Module',
  'Модуль Моделей',
  routeItems,
  routableTags,
  routeRedirects
);

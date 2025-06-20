import { Module } from "../../app/ui/base/module";

import {} from './components';
import type { RoutableCustomComponent, RouteRedirect, SidebarItem } from '../../app/ui/base/types';

const routeItems: SidebarItem[] = [
  {
    name: 'models',
    url: '/models',
    title: 'Модели',
    icon: 'postcard'
  },
];

const routableTags: RoutableCustomComponent[] = [
  {
    pattern: '/models',
    tag: 'models-list',
    type: 'wc',
  },
  {
    pattern: '/models/:modelId',
    tag: 'model-details',
    type: 'wc',
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

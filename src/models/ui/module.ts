import ModelDetails from './widgets/model-details.svelte';
import { Module } from "../../app/ui/base/module";

import {} from './components';
import type { RoutableComponent, RouteRedirect, SidebarItem } from '../../app/ui/base/types';

const routeItems: SidebarItem[] = [
  {
    name: 'models',
    url: '/models',
    title: 'Модели',
    icon: 'postcard'
  },
];

const routableTags: RoutableComponent[] = [
  {
    pattern: '/models',
    tag: 'models-list',
    type: 'wc',
  },
  {
    pattern: '/models/:modelId',
    tag: 'model-details',
    component: ModelDetails,
    type: 'svelte',
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

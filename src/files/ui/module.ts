import type { RootItem, RoutableTags, RouteRedirect } from "#app/ui/base/types";
import { Module } from "../../app/ui/base/module";

import {} from './components';

const routeItems: RootItem[] = [];

const routableTags: RoutableTags[] = []

const routeRedirects: RouteRedirect[] = []

export const filesModule = new Module(
  'File Store Module',
  'Модуль Файлов',
  routeItems,
  routableTags,
  routeRedirects
);

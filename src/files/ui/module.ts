import type { RootItem, RouteRedirect } from "#app/ui/base/types";
import { Module } from "../../app/ui/base/module";

const routeItems: RootItem[] = [];

const routeRedirects: RouteRedirect[] = []

export const filesModule = new Module('File Store Module', 'Модуль Файлов', routeItems, routeRedirects);

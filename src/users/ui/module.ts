import { Module } from "../../app/ui/base/module";
import type { RootItem, RouteRedirect } from "../../app/ui/base/types";
import { usersModuleName, usersModuleTitle } from "../domain/constants";

const routeItems: RootItem[] = [
  {
    name: 'my-profile',
    title: 'Мой профиль',
    icon: 'person-circle'
  },
  {
    name: 'users',
    title: 'Пользователи',
    icon: '	people'
  }
];

// иконки для других модулей
// products	box
// courses	journal-text
// workshops	build

const routeRedirects: RouteRedirect[] = [
  {
    from: '',
    to: '/my-profile',
  },
  {
    from: '/',
    to: '/my-profile',
  }
]

export const usersModule = new Module(usersModuleName, usersModuleTitle, routeItems, routeRedirects);

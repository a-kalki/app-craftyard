import { Module } from "../../app/ui/base/module";
import type { RootItem, RouteRedirect } from "../../app/ui/base/types";

const routeItems: RootItem[] = [
  {
    name: 'my-profile',
    url: '/my-profile',
    title: 'Мой профиль',
    icon: 'person-circle'
  },
  {
    name: 'users',
    url: '/users',
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

export const usersModule = new Module('Users Module', 'Модуль пользователей', routeItems, routeRedirects);

import { Module } from "../../app/ui/base/module";
import type { RootItem, RoutableTags, RouteRedirect } from "../../app/ui/base/types";

import {} from './components';

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

const routableTags: RoutableTags[] = [
  {
    pattern: '/my-profile',
    tag: 'my-profile',
  },
  {
    pattern: '/users',
    tag: 'users-list',
  },
  {
    pattern: '/users/:userId',
    tag: 'user-details',
  },
  {
    pattern: '/users/:userId/edit',
    tag: 'user-edit',
  },
]

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

export const usersModule = new Module(
  'Users Module',
  'Модуль пользователей',
  routeItems,
  routableTags,
  routeRedirects
);

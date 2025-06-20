import { Module } from "../../app/ui/base/module";
import type { SidebarItem, RoutableComponent, RouteRedirect } from "../../app/ui/base/types";

import {} from './components';

const routeItems: SidebarItem[] = [
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

const routableTags: RoutableComponent[] = [
  {
    pattern: '/my-profile',
    tag: 'my-profile',
    type: 'wc',
  },
  {
    pattern: '/users',
    tag: 'users-list',
    type: 'wc',
  },
  {
    pattern: '/users/:userId',
    tag: 'user-details',
    type: 'wc',
  },
  {
    pattern: '/users/:userId/edit',
    tag: 'user-edit',
    type: 'wc',
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

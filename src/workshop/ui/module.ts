import { workshopUrl } from "#workshop/constants";
import { Module } from "../../app/ui/base/module";
import type { SidebarItem, RouteRedirect, RoutableCustomComponent } from "../../app/ui/base/types";

import {} from './components';

const routeItems: SidebarItem[] = [
  {
    name: 'workshop',
    url: workshopUrl,
    title: 'Мастерская',
    icon: 'gear-wide-connected',
    children: [
      {
        name: 'offers',
        url: workshopUrl + '/offers',
        title: 'Офферы',
        icon: 'check2-square',
      },
    ]
  },
];

const routableTags: RoutableCustomComponent[] = [
  {
    pattern: '/workshops/:workshopId',
    tag: 'workshop-details',
    type: 'wc',
  },
]

const routeRedirects: RouteRedirect[] = []

export const workshopsModule = new Module(
  'Workshop Module',
  'Модуль Мастерской',
  routeItems,
  routableTags,
  routeRedirects
);

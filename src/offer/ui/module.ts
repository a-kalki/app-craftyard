import { Module } from "../../app/ui/base/module";
import type { SidebarItem, RouteRedirect, RoutableCustomComponent } from "../../app/ui/base/types";

import {} from './components';

const routeItems: SidebarItem[] = [];

const routableTags: RoutableCustomComponent[] = [
  {
    pattern: '/workshops/:workshopId/offers',
    tag: 'workshop-offers',
    type: 'wc',
  },
  {
    pattern: '/offers/:offerId',
    tag: 'offer-details',
    type: 'wc',
  }
]

const routeRedirects: RouteRedirect[] = []

export const offersModule = new Module(
  'Offers Module',
  'Модуль Офферов',
  routeItems,
  routableTags,
  routeRedirects
);

import type { UserRoleNames } from "./dod";

export const root = 'users';

export const USER_ROLE_TITLES = {
  ONLOOKER: 'Зритель',
  CUSTOMER: 'Заказчик',
  HOBBYIST: 'Хоббист',
  MASTER: 'Мастер',
  MASTER_PLUS: 'Мастер+',
  MENTOR: 'Ментор',
  MENTOR_PLUS: 'Ментор+',
  KEETER: 'Хранитель',
  SUPPORT: 'Поддержка',
}

export const USER_ROLE_DESCRIPTIONS: Record<UserRoleNames, string> = {
  ONLOOKER: 'Зарегестрировался в сообществе и не предпринимал активных действий',
  CUSTOMER: 'Сделал одну или более покупок Изделий или Мастер классов (курсов)',
  HOBBYIST: 'Поработал в мастерской хотя бы один раз в режиме Хобби',
  MASTER: 'Произвел и продал хотя бы одно изделиe',
  MASTER_PLUS: 'Подготовил чертежи и загрузил в систему хотя бы одного изделия',
  MENTOR: 'Провел хотя бы один мастер класс',
  MENTOR_PLUS: 'Подготовил программу и загрузил в систему хотя бы одного мастер класса (курса)',
  KEETER: 'Является работником коворкинг мастерской. Вопросы по мастерской, это к нему',
  SUPPORT: 'Человек имеющий расширенный доступ в приложении. Если есть вопросы, то обращайтесь к нему'
}

export const USER_ROLE_ICONS: Record<UserRoleNames, string> = {
  ONLOOKER: 'eye',
  CUSTOMER: 'cart',
  HOBBYIST: 'wrench',
  MASTER: 'wrench-adjustable',
  MASTER_PLUS: 'wrench-adjustable-circle',
  MENTOR: 'person',
  MENTOR_PLUS: 'people',
  KEETER: 'tools',
  SUPPORT: 'headset'
};


export const USER_ROLES: UserRoleNames[] = Object.keys(USER_ROLE_TITLES) as UserRoleNames[];

export function getMaxPriorityRole(roles: UserRoleNames[]): UserRoleNames {
  return roles
    .filter((role): role is UserRoleNames => USER_ROLES.includes(role))
    .sort((a, b) => USER_ROLES.indexOf(b) - USER_ROLES.indexOf(a))[0];
}

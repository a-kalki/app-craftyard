import type { UserRole } from "./dod";

export const root = 'users';

export const USER_ROLE_TITLES = {
  ONLOOKER: 'Зритель',
  CUSTOMER: 'Заказчик',
  HOBBYIST: 'Хоббист',
  MASTER: 'Мастер',
  MENTOR: 'Ментор',
  KEETER: 'Хранитель'
}

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ONLOOKER: 'Зарегестрировался в сообществе, но пока не предпринимал активных действий',
  CUSTOMER: 'Сделал хотя бы одну покупку Изделия у Мастера (в Мастерской)',
  HOBBYIST: 'Хотя бы один раз пришел в мастерскую (сделал Изделие или прошел мастер класс)',
  MASTER: 'Произвел хотя бы одно Изделие которое было продано',
  MENTOR: 'Провел хотя бы один мастер класс или курс',
  KEETER: 'Является работником коворкинг мастерской и служит людям'
}

export const USER_ROLE_ICONS: Record<UserRole, string> = {
  ONLOOKER: 'eye',
  CUSTOMER: 'cart',
  HOBBYIST: 'hammer',
  MASTER: 'badge-check',
  MENTOR: 'graduation-cap',
  KEETER: 'shield-check'
};

export const USER_ROLES: UserRole[] = Object.keys(USER_ROLE_TITLES) as UserRole[];

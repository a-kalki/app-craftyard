import type { UserRole } from "./dod";

export const root = 'users';

export const USER_ROLES_MAP = {
  HOBBYIST: 'Хоббист',
  MASTER: 'Мастер',
  MENTOR: 'Ментор',
  CUSTOMER: 'Заказчик',
}

export const USER_ROLES: UserRole[] = Object.keys(USER_ROLES_MAP) as UserRole[];

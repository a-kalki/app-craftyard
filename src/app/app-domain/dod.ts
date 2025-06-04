import { USER_ROLE_TITLES } from './constants';

export type UserRole = keyof typeof USER_ROLE_TITLES;

export type UserProfile = {
  skills: Record<string, string>,
  avatarUrl?: string,
};

export type UserDod = {
  id: string, // telegram id
  name: string,
  roles: UserRole[],
  profile: UserProfile,
  joinedAt: number,
};

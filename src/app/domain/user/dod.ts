import { USER_ROLES_MAP } from './constants';

export type UserRole = keyof typeof USER_ROLES_MAP;

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

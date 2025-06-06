import { USER_ROLE_TITLES } from './constants';

export type UserRoleNames = keyof typeof USER_ROLE_TITLES;

export type RoleCounters = Record<UserRoleNames, number>;

export type UserProfile = {
  telegramNickname?: string,
  skills?: Record<string, string>,
  avatarUrl?: string,
};

export type UserDod = {
  id: string, // telegram id
  name: string,
  profile: UserProfile,
  status: {

  }
};

export type UserStats = {
  roleCounters: RoleCounters,
  joinedAt: number,
}

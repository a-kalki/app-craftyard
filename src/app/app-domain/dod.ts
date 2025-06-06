export type UserStatus =
  | 'NEWBIE'
  | 'REACTOR'
  | 'SPEAKER'
  | 'BUYER'
  | 'MAKER'
  | 'SELLER'
  | 'DESIGNER'
  | 'TRAINER'
  | 'AUTHOR'
  | 'KEEPER'
  | 'MODERATOR';

export type UserProfile = {
  telegramNickname?: string,
  skills?: Record<string, string>,
  avatarUrl?: string,
};

export type StatusCounter = {
  count: number;
  firstAt: number;
  lastAt: number;
};

export type StatusStats = {[key in UserStatus]?: StatusCounter};

export type UserDod = {
  id: string, // telegram id
  name: string,
  profile: UserProfile,
  statusStats: StatusStats,
  joinedAt: number,
};

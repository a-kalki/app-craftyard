import type { UserContributions } from "#app/domain/user-contributions/types";

export type Skills = Record<string, string>;

export type UserProfile = {
  telegramNickname?: string,
  avatarUrl?: string,
  skills: Skills,
};

export type UserStatistics = {
  contributions: UserContributions,
}

export type UserAttrs = {
  id: string;
  name: string;
  support?: {
    isModerator?: boolean,
  }
  profile: UserProfile,
  statistics: UserStatistics,
  createAt: number,
  updateAt: number,
};

export type JwtUser = {
  id: string,
  support?: {
    isModerator?: boolean,
  }
}


import type { Contributions } from "#app/domain/contributions/types";

export type Skills = Record<string, string>;

export type UserProfile = {
  telegramNickname?: string,
  avatarUrl?: string,
  skills: Skills,
};

export type UserStatistics = {
  contributions: Contributions,
}

export type UserAttrs = {
  id: string;
  name: string;
  support?: {
    isModerator?: boolean,
  }
  profile: UserProfile,
  statistics: UserStatistics,
  joinedAt: number,
};

export type JwtUser = {
  id: string,
  support?: {
    isModerator?: boolean,
  }
}


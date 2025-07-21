import type { UserContributions } from "#app/domain/user-contributions/types";
import type { JwtDto } from "rilata/core";

export type UserProfile = {
  telegramNickname?: string,
  avatarUrl?: string,
  skillsContentSectionId: string
};

export type UserStatistics = {
  contributions: UserContributions,
}

export type UserAttrs = {
  id: string;
  name: string;
  support?: {
    isModerator?: boolean,
  },
  bindWorkshopId?: string,
  profile: UserProfile,
  statistics: UserStatistics,
  createAt: number,
  updateAt: number,
};

export type JwtUser = JwtDto


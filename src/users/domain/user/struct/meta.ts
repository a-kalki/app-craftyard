import type { AppUser, Contributions } from "#app/domain/types";

export type Skills = Record<string, string>;

export type UserProfile = {
  telegramNickname?: string,
  avatarUrl?: string,
  skills: Skills,
};

export type UserAttrs = AppUser & {
  profile: UserProfile,
  statistics: {
    contributions: Contributions,
  },
};

export type UserArMeta = {
    name: "UserAr",
    title: "Пользователь приложения Dedok",
    attrs: UserAttrs,
    events: []
}

import type { UserDod } from "../../app-domain/dod";
import type { Result } from "../../app-domain/types";

export type RegisterUserDto =
  Pick<UserDod, 'id' | 'name' | 'telegramNickname'>
  & Pick<UserDod['profile'], 'avatarUrl'>

export type FindUserResult = Result<UserDod, 'User not found'>;

export type RegisterUserResult = Result<'success', string>;

export interface UserApiInterface {
  registerUser(dto: RegisterUserDto): Promise<RegisterUserResult>;

  findUser(userId: string): Promise<FindUserResult>;
}

export type TelegramUser = {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string,
  language_code?: string;
}

export type TelegramAuthUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

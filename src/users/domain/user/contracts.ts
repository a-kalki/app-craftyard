import type { UserDod } from "../../../app/app-domain/dod";

export type FindUserCommand = {
  command: 'find-user',
  dto: { id: string },
};

export type FindUserResult = UserDod | undefined;

export type RegisterUserCommand = {
  command: 'register-user',
  dto: Omit<UserDod, 'joinedAt'>
};

export type RegisterUserResult = void;

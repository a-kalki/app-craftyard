import type { UserDod } from "../../../app/app-domain/dod";

// ========== find-user ============
export type FindUserCommand = {
  command: 'find-user',
  dto: { id: string },
};

export type FindUserResult = UserDod | undefined;

// ========== get-users ============
export type GetUsersCommand = {
  command: 'get-users',
  dto: Record<never, unknown>
};

export type GetUsersResult = UserDod[];

// ========== register-user ============
export type RegisterUserCommand = {
  command: 'register-user',
  dto: Omit<UserDod, 'joinedAt'>
};

export type RegisterUserResult = void;

import type { UserDod } from "../../../app/app-domain/dod";
import type { Result } from "../../../app/app-domain/types";
import type { RegisterUserDto } from "../../../app/ui/base-run/run-types";

// ========== find-user ============
export type FindUserCommand = {
  command: 'find-user',
  dto: { id: string },
};

// ========== get-users ============
export type GetUsersCommand = {
  command: 'get-users',
  dto: Record<never, unknown>
};

export type GetUsersResult = Result<UserDod[], never>;

// ========== register-user ============
export type RegisterUserCommand = {
  command: 'register-user',
  dto: RegisterUserDto
};

// ========== edit-user ============
export type EditUserCommand = {
  command: 'edit-user',
  dto: Pick<UserDod, 'id' | 'name' | 'profile'>
};

export type EditUserByModeratorCommand = {
  command: 'edit-user',
  dto: EditUserCommand['dto'] & Pick<UserDod, 'statusStats'> 
};

export type EditUserResult = Result<'success', string>;

import type { RegisterUserDto } from "#app/ui/base-run/run-types";

// ========== commands ============
export type RegisterUserCommand = {
  command: 'register-user',
  dto: RegisterUserDto
};

// ========== success ============
export type RegisterUserSuccess = {
  status: 'success',
};

// ========== errors ============
export type AlreadyExistsError = {
  name: 'AlreadyExistsError',
  type: 'domain-error',
}

// ========== events ============
export type UserRegisteredEvent = {
  name: 'UserRegisteredEvent'
  requestId: string,
  description?: 'Оповещает о регистрации нового пользователя',
  attrs: RegisterUserCommand,
}

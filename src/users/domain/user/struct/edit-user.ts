import type { UserAttrs } from "./meta";

// ========== commands ============
export type EditUserCommand = {
  command: 'edit-user',
  dto: Pick<UserAttrs, 'id' | 'name' | 'profile'>
};

export type EditUserByModeratorCommand = {
  command: 'edit-user',
  dto: EditUserCommand['dto'] & Pick<UserAttrs['statistics'], 'contributions'> 
};

// ========== success ============
export type EditUserSuccess = {
  status: 'success',
};

// ========== errors ============
export type NotPermittedError = {
  name: 'NotPermittedError',
  type: 'domain-error',
}

// ========== events ============
export type UserEditedEvent = {
  name: 'UserEditedEvent'
  requestId: string,
  description?: 'Оповещает об изменении пользователя',
  attrs: EditUserByModeratorCommand,
}

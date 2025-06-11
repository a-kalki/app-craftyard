import type { UserAttrs } from "./meta";

// ========== commands ============
export type GetUserCommand = {
  command: 'get-user',
  dto: { id: string },
};

// ========== success ============
export type GetUserSuccess = {
  attrs: UserAttrs
};

// ========== errors ============
export type NotFoundError = {
  name: 'NotFoundError',
  type: 'domain-error',
}

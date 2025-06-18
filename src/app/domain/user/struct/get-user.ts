import type { UserArMeta } from "../meta";
import type { UserAttrs } from "./attrs";

// ========== commands ============
export type GetUserCommand = {
  name: 'get-user',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetUserSuccess = UserAttrs;

// ========== errors ============
export type UserDoesNotExistError = {
  name: 'UserDoesNotExistError',
  type: 'domain-error',
}

// ========== uc-meta ============
export type GetUserMeta = {
  name: 'Get User Use Case'
  in: GetUserCommand,
  success: GetUserSuccess,
  errors: UserDoesNotExistError,
  events: never,
  aRoot: UserArMeta,
}

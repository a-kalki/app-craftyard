import type { UserDoesNotExistError } from "#app/ui/base-run/run-types";
import type { UserArMeta } from "../meta";
import type { UserAttrs } from "./attrs";

// ========== commands ============
export type EditUserCommand = {
  name: 'edit-user',
  attrs: Pick<UserAttrs, 'id' | 'name' | 'profile'> & Partial<Pick<UserAttrs, 'statistics'>>,
  requestId: string,
};

// ========== success ============
export type EditUserSuccess = {
  status: 'success',
};

// ========== errors ============
export type NotPermittedError = {
  name: 'Not Permitted Error',
  type: 'domain-error',
}

// ========== uc-meta ============
export type EditUserMeta = {
  name: 'Edit User Use Case'
  in: EditUserCommand,
  success: EditUserSuccess,
  errors: NotPermittedError | UserDoesNotExistError
  events: never,
  aRoot: UserArMeta,
}

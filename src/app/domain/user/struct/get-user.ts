import type { UserDoesNotExistError } from "#app/ui/base-run/run-types";
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

// ========== uc-meta ============
export type GetUserMeta = {
  name: 'Get User Use Case'
  in: GetUserCommand,
  success: GetUserSuccess,
  errors: UserDoesNotExistError,
  events: never,
  aRoot: UserArMeta,
}

import type { UserDoesNotExistError } from "#app/ui/base-run/run-types";
import type { UserAttrs } from "../user";
import type { UserArMeta } from "./meta";

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

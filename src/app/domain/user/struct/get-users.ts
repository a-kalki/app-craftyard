import type { UserAttrs } from "../user";
import type { UserArMeta } from "./meta";

// ========== commands ============
export type GetUsersCommand = {
  name: 'get-users',
  attrs: Record<never, unknown>
  requestId: string
};

// ========== success ============
export type GetUsersSuccess = UserAttrs[];

// ========== uc-meta ============
export type GetUsersMeta = {
  name: 'Get Users Use Case'
  requestId: string,
  in: GetUsersCommand,
  success: GetUsersSuccess,
  errors: never,
  events: never,
  aRoot: UserArMeta,
}

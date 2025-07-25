import type { UserArMeta } from "../../meta";
import type { UserAttrs } from "../attrs";

// ========== commands ============
export type GetUsersCommand = {
  name: 'get-users',
  attrs: Partial<UserAttrs>,
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

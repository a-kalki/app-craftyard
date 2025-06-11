import type { UserAttrs } from "./meta";

// ========== commands ============
export type GetUsersCommand = {
  command: 'get-users',
  dto: Record<never, unknown>
};

// ========== success ============
export type GetUsersSuccess = {
  attrs: UserAttrs[]
};

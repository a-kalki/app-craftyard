import type { UserArMeta } from "../meta";

// ========== commands ============
export type RefreshUserCommand = {
  name: 'refresh-user',
  attrs: { refreshToken: string },
  requestId: string,
};

// ========== success ============
export type RefreshUserSuccess = { accessToken: string };

// ========== uc-meta ============
export type RefreshUserMeta = {
  name: 'Refresh User Use Case'
  in: RefreshUserCommand,
  success: RefreshUserSuccess,
  errors: never,
  events: never,
  aRoot: UserArMeta,
}

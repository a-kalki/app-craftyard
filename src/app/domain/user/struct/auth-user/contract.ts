import type { UserArMeta } from "../../meta";
import type { UserAttrs } from "../attrs";
import type { UserDoesNotExistError } from "../get-user/contract";

export type TokenType = {
  access: string,
  refresh: string,
}

export type AuthData = {
  type: 'widget-login' | 'mini-app-login';
  data: string,
}

// ========== commands ============
export type AuthUserCommand = {
  name: 'auth-user',
  attrs: AuthData,
  requestId: string,
};

// ========== success ============
export type AuthUserSuccess = {
  user: UserAttrs,
  token: TokenType,
};

// ========== errors ============
export type AuthHashNotValid = {
  name: 'Auth Hash Not Valid',
  type: 'domain-error',
};

// ========== uc-meta ============
export type AuthUserMeta = {
  name: 'Auth User Use Case'
  in: AuthUserCommand,
  success: AuthUserSuccess,
  errors: UserDoesNotExistError | AuthHashNotValid,
  events: never,
  aRoot: UserArMeta,
}

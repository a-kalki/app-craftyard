import type { EditingIsNotPermittedError } from "#app/core/errors";
import type { UserArMeta } from "#users/domain/user/meta";
import type { UserDoesNotExistError } from "#users/domain/user/struct/get-user/contract";
import type { UserContributionKey } from "../../types";

// ========== commands ============
export type IncrementContributionAttrs = {
  userId: string,
  key: UserContributionKey,
}

export type IncrementContributionCommand = {
  name: 'increment-user-contribution',
  attrs: IncrementContributionAttrs,
  requestId: string,
};

// ========== success ============
export type IncrementContributionSuccess = boolean;

// ========== uc-meta ============
export type IncrementContributionMeta = {
  name: 'Increment User Contribution Use Case'
  in: IncrementContributionCommand,
  success: IncrementContributionSuccess,
  errors: EditingIsNotPermittedError | UserDoesNotExistError
  events: never,
  aRoot: UserArMeta,
}

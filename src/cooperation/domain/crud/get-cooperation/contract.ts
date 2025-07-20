import type { AggregateDoesNotExistError } from "#app/domain/errors";
import type { NodeArMeta } from "#cooperation/domain/base/node/meta";
import type { CooperationAttrs } from "#cooperation/domain/types";

// ========== commands ============
export type GetCooperationCommand = {
  name: 'get-cooperation',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetCooperationSuccess = CooperationAttrs;

// ========== uc-meta ============
export type GetCooperationMeta = {
  name: 'Get Cooperation Use Case'
  in: GetCooperationCommand,
  success: GetCooperationSuccess,
  errors: AggregateDoesNotExistError,
  events: never,
  aRoot: NodeArMeta,
}

import type { NodeArMeta } from "#cooperation/domain/base/node/meta";
import type { CooperationDbo as CooperationAttrs } from "#cooperation/domain/types";

// ========== commands ============
export type GetRootCooperationsCommand = {
  name: 'get-root-cooperations',
  attrs: { rootId: string },
  requestId: string,
};

// ========== success ============
export type GetRootCooperationsSuccess = CooperationAttrs[];

// ========== uc-meta ============
export type GetRootCooperationDbosMeta = {
  name: 'Get Root Cooperations Use Case'
  in: GetRootCooperationsCommand,
  success: GetRootCooperationsSuccess,
  errors: never,
  events: never,
  aRoot: NodeArMeta,
}

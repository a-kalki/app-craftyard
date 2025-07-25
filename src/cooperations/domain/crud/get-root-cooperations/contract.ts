import type { CooperationDbo as CooperationAttrs } from "#cooperations/domain/types";
import type { NodeArMeta } from "#cooperations/domain/base/node/meta";

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

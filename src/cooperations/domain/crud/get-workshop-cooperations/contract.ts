import type { NodeArMeta } from "#cooperations/domain/base/node/meta";
import type { CooperationAttrs } from "#cooperations/domain/types";

// ========== commands ============
export type GetWorkshopCooperationsCommand = {
  name: 'get-workshop-cooperations',
  attrs: { workshopId: string },
  requestId: string,
};

// ========== success ============
export type GetWorkshopCooperationsSuccess = CooperationAttrs[];

// ========== uc-meta ============
export type GetWorkshopCooperationsMeta = {
  name: 'Get Root Cooperation Dbos Use Case'
  in: GetWorkshopCooperationsCommand,
  success: GetWorkshopCooperationsSuccess,
  errors: never,
  events: never,
  aRoot: NodeArMeta,
}

import type { CooperationDbo } from "#cooperation/domain/types";
import type { NodeArMeta } from "../../meta";

// ========== commands ============
export type GetRootCooperationDbosCommand = {
  name: 'get-root-cooperation-dbos',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetRootCooperationDbosSuccess = CooperationDbo[];

// ========== uc-meta ============
export type GetRootCooperationDbosMeta = {
  name: 'Get Root Cooperation Dbos Use Case'
  in: GetRootCooperationDbosCommand,
  success: GetRootCooperationDbosSuccess,
  errors: never,
  events: never,
  aRoot: NodeArMeta,
}

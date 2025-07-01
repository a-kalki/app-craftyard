import type { WorkshopArMeta } from "../../meta";
import type { WorkshopAttrs } from "../attrs";

// ========== commands ============
export type GetWorkshopCommand = {
  name: 'get-workshop',
  attrs: { id: string },
  requestId: string,
};

// ========== success ============
export type GetWorkshopSuccess = WorkshopAttrs


// ========== errors ============
export type WorkshopDoesNotExistError = {
  name: 'WorkshopDoesNotExistError',
  type: 'domain-error',
};

// ========== uc-meta ============
export type GetWorkshopMeta = {
  name: 'Get Workshop Use Case'
  in: GetWorkshopCommand,
  success: GetWorkshopSuccess,
  errors: WorkshopDoesNotExistError,
  events: never,
  aRoot: WorkshopArMeta,
}

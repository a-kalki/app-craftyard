import type { BackendResultByMeta } from "rilata/core";
import type { FileEntryAttrs } from "../attrs";
import type { FileEntryArMeta } from "../../meta";

// ========== command ============
export type GetFilesCommand = {
  name: 'get-files',
  attrs: { ids: string[] },
  requestId: string,
}

// ========== meta ============
export type GetFilesUcMeta = {
  name: 'Get Files Use Case'
  in: GetFilesCommand,
  success: FileEntryAttrs[],
  errors: never,
  events: never,
  aRoot: FileEntryArMeta,
}

export type GetFilesEntryResult = BackendResultByMeta<GetFilesUcMeta>;

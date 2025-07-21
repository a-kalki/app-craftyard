import type { BackendResultByMeta, Caller } from "rilata/core";
import type { AddContentSectionCommand, AddContentSectionMeta } from "./struct/add-section/contract";

export interface ApiUserContentsSectionFacade {
  addContentSection(
    attrs: AddContentSectionCommand['attrs'], caller: Caller, reqId: string
  ): Promise<BackendResultByMeta<AddContentSectionMeta>>
}

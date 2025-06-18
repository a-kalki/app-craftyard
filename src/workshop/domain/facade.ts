import type { BackendResultByMeta } from "rilata/core";
import type { GetWorkshopMeta } from "./struct/get-workshop";

export interface WorkshopsFacade {
  getWorkshop(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetWorkshopMeta>>
}

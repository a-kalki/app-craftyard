import type { BackendResultByMeta, Caller } from "rilata/core";
import type { GetWorkshopMeta } from "./struct/get-workshop/contract";

export interface UiWorkshopsFacade {
  getWorkshop(id: string): Promise<BackendResultByMeta<GetWorkshopMeta>>
}

export interface ApiWorkshopsFacade {
  getWorkshop(
    id: string, caller: Caller, reqId: string,
  ): Promise<BackendResultByMeta<GetWorkshopMeta>>
}

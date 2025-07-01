import type { BackendResultByMeta, Caller } from "rilata/core";
import type { GetWorkshopCommand, GetWorkshopMeta } from "./struct/get-workshop/contract";

export interface UiWorkshopsFacade {
  getWorkshop(id: string): Promise<BackendResultByMeta<GetWorkshopMeta>>
}

export interface ApiWorkshopsFacade {
  getWorkshop(input: GetWorkshopCommand, caller: Caller): Promise<BackendResultByMeta<GetWorkshopMeta>>
}

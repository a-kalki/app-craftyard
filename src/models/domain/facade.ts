import type { BackendResultByMeta, Caller } from "rilata/core"
import type { GetModelsMeta } from "./struct/get-models/contract";
import type { GetModelMeta } from "./struct/get-model/contract";

export interface UiModelsFacade {
  getModel(id: string): Promise<BackendResultByMeta<GetModelMeta>>

  getModels(): Promise<BackendResultByMeta<GetModelsMeta>>
}

export interface ApiModelFacade {
  getModel(id: string, caller: Caller, reqId: string): Promise<BackendResultByMeta<GetModelMeta>>
}

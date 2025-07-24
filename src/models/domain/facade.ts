import type { BackendResultByMeta, Caller } from "rilata/core"
import type { GetModelsMeta } from "./struct/get-models/contract";
import type { GetModelMeta } from "./struct/get-model/contract";
import type { ModelAttrs } from "./struct/attrs";

export interface UiModelsFacade {
  getModel(id: string): Promise<BackendResultByMeta<GetModelMeta>>

  getModels(attrs: Partial<ModelAttrs>): Promise<BackendResultByMeta<GetModelsMeta>>
}

export interface ApiModelFacade {
  getModel(id: string, caller: Caller, reqId: string): Promise<BackendResultByMeta<GetModelMeta>>
}

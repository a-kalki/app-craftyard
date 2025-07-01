import type { BackendResultByMeta } from "rilata/core"
import type { GetModelsMeta } from "./struct/get-models/contract";
import type { GetModelMeta } from "./struct/get-model/contract";

export interface UiModelsFacade {
  getModel(id: string): Promise<BackendResultByMeta<GetModelMeta>>

  getModels(): Promise<BackendResultByMeta<GetModelsMeta>>
}

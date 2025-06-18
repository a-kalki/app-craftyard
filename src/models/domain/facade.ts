import type { BackendResultByMeta } from "rilata/core"
import type { GetModelsMeta } from "./struct/get-models"
import type { GetModelMeta } from "./struct/get-model"

export interface ModelsFacade {
  getModel(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetModelMeta>>

  getModels(forceRefresh?: boolean): Promise<BackendResultByMeta<GetModelsMeta>>
}

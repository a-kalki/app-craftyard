import type { ApiModelFacade } from "#models/domain/facade";
import type { Caller, BackendResultByMeta } from "rilata/core";
import type { ModelModule } from "./module";
import type { GetModelCommand, GetModelMeta } from "#models/domain/struct/get-model/contract";

export class ModelBackendFacade implements ApiModelFacade {
  constructor(private module: ModelModule) {}

  async getModel(
    modelId: string, caller: Caller, requestId: string,
  ): Promise<BackendResultByMeta<GetModelMeta>> {
    const command: GetModelCommand = {
      name: 'get-model',
      attrs: { id: modelId },
      requestId,
    }
    return this.module.handleRequest(command, { caller }) as unknown as BackendResultByMeta<GetModelMeta>;
  }
}

import { jwtDecoder } from "#app/ui/base-run/app-resolves";
import { BaseBackendApi } from "#app/ui/base/base-api";
import { modelApiUrl } from "#models/constants";
import type { AddModelImagesCommand, AddModelImagesMeta } from "#models/domain/struct/add-images";
import type { ModelAttrs } from "#models/domain/struct/attrs";
import type { DeleteModelImageCommand, DeleteModelImageMeta } from "#models/domain/struct/delete-image";
import type { GetModelCommand, GetModelMeta } from "#models/domain/struct/get-model";
import type { GetModelsCommand, GetModelsMeta } from "#models/domain/struct/get-models";
import { success, type BackendResultByMeta } from "rilata/core";

class ModelsApi extends BaseBackendApi<ModelAttrs> {
  async getModel(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetModelMeta>> {
    const cached = this.getFromCacheById(id, forceRefresh);
    if (cached) return success(cached);

    const command: GetModelCommand = {
        name: "get-model",
        attrs: { id },
        requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetModelMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(result.value.id, result.value);
    }
    return result;
  }

  async getModels(forceRefresh?: boolean): Promise<BackendResultByMeta<GetModelsMeta>> {
    const cached = this.getFromCacheList(forceRefresh);
    if (cached) return success(cached);

    const command: GetModelsCommand = {
      name: 'get-models',
      attrs: {},
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetModelsMeta>(command);
    if (result.isSuccess()) {
      this.setCacheList(result.value);
      result.value.forEach(m => this.setCacheById(m.id, m));
    }
    return result;
  }

  addModelImages(id: string, imageIds: string[]): Promise<BackendResultByMeta<AddModelImagesMeta>> {
    const command: AddModelImagesCommand = {
      name: "add-model-images",
      attrs: { id, imageIds },
      requestId: crypto.randomUUID(),
    }
    return this.request<AddModelImagesMeta>(command);
  }

  deleteImage(id: string, imageId: string): Promise<BackendResultByMeta<DeleteModelImageMeta>> {
    const command: DeleteModelImageCommand = {
      name: 'delete-model-image',
      attrs: { id, imageId },
      requestId: crypto.randomUUID(),
    }
    return this.request<DeleteModelImageMeta>(command);
  }
}

export const modelsApi = new ModelsApi(modelApiUrl, jwtDecoder);

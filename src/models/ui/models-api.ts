import { BaseBackendApi } from "#app/ui/base/base-api";
import { modelApiUrl } from "#models/constants";
import type { UiModelsFacade } from "#models/domain/facade";
import type { ModelAttrs } from "#models/domain/struct/attrs";
import type { AddModelImagesCommand, AddModelImagesMeta } from "#models/domain/struct/add-images/contract";
import type { DeleteModelImageCommand, DeleteModelImageMeta } from "#models/domain/struct/delete-image/contract";
import type { EditModelCommand, EditModelMeta } from "#models/domain/struct/edit-model/contract";
import type { GetModelCommand, GetModelMeta } from "#models/domain/struct/get-model/contract";
import type { GetModelsCommand, GetModelsMeta } from "#models/domain/struct/get-models/contract";
import type { ReorderModelImagesCommand, ReorderModelImagesMeta } from "#models/domain/struct/reorder-images/contract";
import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";

export class ModelsBackendApi extends BaseBackendApi<ModelAttrs> implements UiModelsFacade {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(modelApiUrl, jwtDecoder, cacheTtlAsMin);
  }
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

  async editModel(attrs: EditModelCommand['attrs']): Promise<BackendResultByMeta<EditModelMeta>> {
    const command: EditModelCommand = {
      name: "edit-model",
      attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<EditModelMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(attrs.id);
      this.removeListCache();
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

  addModelImages(id: string, pushImageIds: string[]): Promise<BackendResultByMeta<AddModelImagesMeta>> {
    const command: AddModelImagesCommand = {
      name: "add-model-images",
      attrs: { id, pushImageIds },
      requestId: crypto.randomUUID(),
    }
    return this.request<AddModelImagesMeta>(command);
  }

  reorderModelImages(
    id: string, reorderedImageIds: string[],
  ): Promise<BackendResultByMeta<ReorderModelImagesMeta>> {
    const command: ReorderModelImagesCommand = {
      name: "reorder-model-images",
      attrs: { id, reorderedImageIds },
      requestId: crypto.randomUUID(),
    }
    return this.request<ReorderModelImagesMeta>(command);
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

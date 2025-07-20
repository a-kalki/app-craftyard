import { BaseBackendApi } from "#app/ui/base/base-api";
import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";
import type { CooperationAttrs } from "#cooperation/domain/types";
import { cooperationApiUrl } from "#cooperation/constants";
import type { GetCooperationCommand, GetCooperationMeta } from "#cooperation/domain/crud/get-cooperation/contract";
import type { GetWorkshopCooperationsCommand, GetWorkshopCooperationsMeta, GetWorkshopCooperationsSuccess } from "#cooperation/domain/crud/get-workshop-cooperations/contract";
import type { GetRootCooperationsCommand, GetRootCooperationDbosMeta, GetRootCooperationsSuccess } from "#cooperation/domain/crud/get-root-cooperations/contract";

export class CooperationBackendApi extends BaseBackendApi<CooperationAttrs> {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(cooperationApiUrl, jwtDecoder, cacheTtlAsMin);
  }
  async getCooperation(
     id: string, forceRefresh?: boolean,
  ): Promise<BackendResultByMeta<GetCooperationMeta>> {
    const cached = this.getFromCacheById(id, forceRefresh);
    if (cached) return success(cached);

    const command: GetCooperationCommand = {
        name: 'get-cooperation',
        attrs: { id },
        requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetCooperationMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(result.value.id, result.value);
    }
    return result;
  }

  async getRootCooperations(
    rootId: string, forceRefresh?: boolean
  ): Promise<BackendResultByMeta<GetRootCooperationDbosMeta>> {
    const otherKey = 'root-cooperations';
    const cached = this.getOtherFromCacheById(rootId, otherKey, forceRefresh);
    if (cached) return success(cached as GetRootCooperationsSuccess);

    const command: GetRootCooperationsCommand = {
      name: 'get-root-cooperations',
      attrs: { rootId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetRootCooperationDbosMeta>(command);
    if (result.isSuccess()) {
      this.setOtherCacheById(rootId, result.value, otherKey);
      result.value.forEach(c => this.setCacheById(c.id, c as CooperationAttrs));
    }
    return result;
  }

  async getWorkshopCooperations(
    workshopId: string, forceRefresh?: boolean
  ): Promise<BackendResultByMeta<GetWorkshopCooperationsMeta>> {
    const otherKey = 'workshop-cooperations';
    const cached = this.getOtherFromCacheById(workshopId, otherKey, forceRefresh);
    if (cached) return success(cached as GetWorkshopCooperationsSuccess);

    const command: GetWorkshopCooperationsCommand = {
      name: 'get-workshop-cooperations',
      attrs: { workshopId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetWorkshopCooperationsMeta>(command);
    if (result.isSuccess()) {
      this.setOtherCacheById(workshopId, result.value, otherKey);
      result.value.forEach(m => this.setCacheById(m.id, m));
    }
    return result;
  }
}

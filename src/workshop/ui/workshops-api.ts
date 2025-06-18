import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";
import { BaseBackendApi } from "#app/ui/base/base-api";
import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";
import type { GetWorkshopCommand, GetWorkshopMeta } from "#workshop/domain/struct/get-workshop";
import type { WorkshopsFacade } from "#workshop/domain/facade";
import { workshopsApiUrl } from "#workshop/constants";

export class WorkshopsBackendApi extends BaseBackendApi<WorkshopAttrs> implements WorkshopsFacade {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(workshopsApiUrl, jwtDecoder, cacheTtlAsMin);
  }

  async getWorkshop(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetWorkshopMeta>> {
    const cached = this.getFromCacheById(id, forceRefresh);
    if (cached) return success(cached);

    const command: GetWorkshopCommand = {
        name: "get-workshop",
        attrs: { id },
        requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetWorkshopMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(result.value.id, result.value);
    }
    return result;
  }
}

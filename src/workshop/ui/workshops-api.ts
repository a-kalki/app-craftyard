import { jwtDecoder } from "#app/ui/base-run/app-resolves";
import { BaseBackendApi } from "#app/ui/base/base-api";
import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";
import { workshopsApiUrl } from "#workshop/constants";
import type { GetWorkshopCommand, GetWorkshopMeta } from "#workshop/domain/struct/get-workshop";
import { success, type BackendResultByMeta } from "rilata/core";

class WorkshopsApi extends BaseBackendApi<WorkshopAttrs> {
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

export const workshopsApi = new WorkshopsApi(workshopsApiUrl, jwtDecoder);

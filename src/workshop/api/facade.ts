import type { ApiWorkshopsFacade } from "#workshop/domain/facade";
import type { GetWorkshopCommand, GetWorkshopMeta } from "#workshop/domain/struct/get-workshop/contract";
import type { Caller, BackendResultByMeta } from "rilata/core";
import type { WorkshopsModule } from "./module";

export class WorkshopBackendFacade implements ApiWorkshopsFacade {
  constructor(private module: WorkshopsModule) {}

  async getWorkshop(workshopId: string, caller: Caller): Promise<BackendResultByMeta<GetWorkshopMeta>> {
    const command: GetWorkshopCommand = {
        name: "get-workshop",
        attrs: {
            id: workshopId
        },
        requestId: crypto.randomUUID(),
    }
    return this.module.handleRequest(command, { caller }) as unknown as BackendResultByMeta<GetWorkshopMeta>;
  }
}

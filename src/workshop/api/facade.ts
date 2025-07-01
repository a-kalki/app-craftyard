import type { ApiWorkshopsFacade } from "#workshop/domain/facade";
import type { GetWorkshopCommand, GetWorkshopMeta } from "#workshop/domain/struct/get-workshop/contract";
import type { Caller, BackendResultByMeta } from "rilata/core";
import type { WorkshopsModule } from "./module";

export class WorkshopBackendFacade implements ApiWorkshopsFacade {
  constructor(private module: WorkshopsModule) {}

  getWorkshop(input: GetWorkshopCommand, caller: Caller): Promise<BackendResultByMeta<GetWorkshopMeta>> {
    throw new Error("Method not implemented.");
  }
}

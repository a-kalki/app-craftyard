import { QueryUseCase } from "rilata/api";
import { failure, success, type Result, type UCMeta } from "rilata/core";
import type { WorkshopsModuleResolvers } from "./types";
import type { WorkshopDoesNotExistError } from "#workshop/domain/struct/get-workshop";
import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";

export abstract class WorkshopsUseCase<META extends UCMeta> extends QueryUseCase<
  WorkshopsModuleResolvers, META
> {
  protected transactionStrategy!: never;

  async getWsAttrs(wsId: string): Promise<Result<WorkshopDoesNotExistError, WorkshopAttrs>> {
    const wsAttrs = await this.moduleResolver.workshopRepo.findWorkshop(wsId);
    if (!wsAttrs) {
      return failure({
        name: 'WorkshopDoesNotExistError',
        type: 'domain-error',
      });
    }
    return success(wsAttrs);
  }
}

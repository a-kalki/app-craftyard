import type { RequestScope, RunDomainResult } from "rilata/api";
import { failure, success } from "rilata/core";
import { getWorkshopValidator } from "./v-map";
import type { GetWorkshopCommand, GetWorkshopMeta } from "#workshop/domain/struct/get-workshop";
import { WorkshopsUseCase } from "#workshop/api/base-use-case";

export class GetWorkshopUC extends WorkshopsUseCase<GetWorkshopMeta> {
  arName = "WorkshopAr" as const;

  name = "Get Workshop Use Case" as const;

  inputName = "get-workshop" as const;

  protected supportAnonimousCall = true;

  protected validator = getWorkshopValidator;

  async runDomain(
    input: GetWorkshopCommand, requestData: RequestScope,
  ): Promise<RunDomainResult<GetWorkshopMeta>> {
    const workshop = await this.moduleResolver.db.findWorkshop(input.attrs.id);
    return workshop
      ? success(workshop)
      : failure({
        name: 'WorkshopDoesNotExistError',
        type: 'domain-error',
      });
  }
}

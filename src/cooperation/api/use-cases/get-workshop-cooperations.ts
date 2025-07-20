import type {
  GetWorkshopCooperationsCommand, GetWorkshopCooperationsMeta,
} from "#cooperation/domain/crud/get-workshop-cooperations/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { CooperationUseCase } from "../base-uc";
import { getWorkshopCooperationsValidator } from "#cooperation/domain/crud/get-workshop-cooperations/v-map";
import { success } from "rilata/core";

export class GetWorkshopCooperationsUC extends CooperationUseCase<GetWorkshopCooperationsMeta> {
    arName = 'CooperationAr';

    name = "Get Root Cooperation Dbos Use Case" as const;

    inputName = "get-workshop-cooperations" as const;

    protected supportAnonimousCall = true;

    protected validator = getWorkshopCooperationsValidator;

    async runDomain(
      input: GetWorkshopCooperationsCommand, reqScope: RequestScope,
    ): Promise<DomainResult<GetWorkshopCooperationsMeta>> {
    const repo = this.moduleResolver.cooperationRepo;

    return success(await repo.getWorkshopAttrs(input.attrs.workshopId));
    }

}

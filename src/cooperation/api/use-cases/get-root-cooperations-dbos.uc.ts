import type { RequestScope, DomainResult } from "rilata/api";
import { CooperationUseCase } from "../base-uc";
import { success } from "rilata/core";
import type {
  GetRootCooperationsCommand, GetRootCooperationDbosMeta
} from "#cooperation/domain/crud/get-root-cooperations/contract";
import { getRootCooperationsValidator } from "#cooperation/domain/crud/get-root-cooperations/v-map";

export class GetRootCooperationDbosUseCase extends CooperationUseCase<GetRootCooperationDbosMeta> {
  arName = 'CooperationAr' as const;

  name = "Get Root Cooperations Use Case" as const;

  inputName = "get-root-cooperations" as const;

  protected supportAnonimousCall = true;

  protected validator = getRootCooperationsValidator;

  async runDomain(
    input: GetRootCooperationsCommand, reqScope: RequestScope
  ): Promise<DomainResult<GetRootCooperationDbosMeta>> {
    const repo = this.moduleResolver.cooperationRepo;

    return success(await repo.getRootAttrs(input.attrs.rootId));
  }
}

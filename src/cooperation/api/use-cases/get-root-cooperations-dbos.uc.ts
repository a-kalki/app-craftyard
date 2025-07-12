import type { RequestScope, DomainResult } from "rilata/api";
import { CooperationUseCase } from "../base-uc";
import { success } from "rilata/core";
import type {
  GetRootCooperationDbosCommand, GetRootCooperationDbosMeta
} from "#cooperation/domain/base/node/struct/get-root-cooperations/contract";
import { getRootCooperationDbosValidator } from "#cooperation/domain/base/node/struct/get-root-cooperations/v-map";

export class GetRootCooperationDbosUseCase extends CooperationUseCase<GetRootCooperationDbosMeta> {
  arName = 'CooperationAr' as const;

  name = "Get Root Cooperation Dbos Use Case" as const;

  inputName = "get-root-cooperation-dbos" as const;

  protected supportAnonimousCall = true;

  protected validator = getRootCooperationDbosValidator;

  async runDomain(
    input: GetRootCooperationDbosCommand, reqScope: RequestScope
  ): Promise<DomainResult<GetRootCooperationDbosMeta>> {
    const repo = this.moduleResolver.cooperationRepo;

    return success(await repo.getRootAttrs(input.attrs.id));
  }
}

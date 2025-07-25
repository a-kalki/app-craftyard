import type {
  GetCooperationCommand, GetCooperationMeta
} from "#cooperations/domain/crud/get-cooperation/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { CooperationUseCase } from "../base-uc";
import { getCooperationValidator } from "#cooperations/domain/crud/get-cooperation/v-map";
import { failure, success } from "rilata/core";

export class GetCooperationUseCase extends CooperationUseCase<GetCooperationMeta> {
  arName = 'CooperationAr' as const;

  name = "Get Cooperation Use Case" as const;

  inputName = "get-cooperation" as const;

  protected supportAnonimousCall = true;

  protected validator = getCooperationValidator;

  async runDomain(
    input: GetCooperationCommand, reqScope: RequestScope
  ): Promise<DomainResult<GetCooperationMeta>> {
    const getResult = await this.getCooperationAr(input.attrs.id);
    if (getResult.isFailure()) return failure(getResult.value);
    return success(getResult.value.getAttrs());
  }
}

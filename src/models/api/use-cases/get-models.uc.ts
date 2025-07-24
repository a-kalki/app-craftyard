import type { GetModelsCommand, GetModelsMeta } from "#models/domain/struct/get-models/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { ModelUseCase } from "../base-uc";
import { success } from "rilata/core";
import { getModelsValidator } from "#models/domain/struct/get-models/v-map";

export class GetModelsUC extends ModelUseCase<GetModelsMeta> {
  arName = "ModelAr" as const;

  name = "Get Model Use Case" as const;

  inputName = "get-models" as const;

  protected supportAnonimousCall = true;

  protected validator = getModelsValidator;

  async runDomain(input: GetModelsCommand, requestData: RequestScope): Promise<DomainResult<GetModelsMeta>> {
    return success(await this.moduleResolver.modelRepo.filter(input.attrs));
  }
}

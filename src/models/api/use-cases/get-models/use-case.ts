import type { GetModelsCommand, GetModelsMeta } from "#models/domain/struct/get-models";
import type { RequestScope, RunDomainResult } from "rilata/api";
import { ModelUseCase } from "../../base-use-case";
import { getModelsValidator } from "./v-map";
import { success } from "rilata/core";

export class GetModelsUC extends ModelUseCase<GetModelsMeta> {
    arName = "ModelAr" as const;

    name = "Get Model Use Case" as const;

    inputName = "get-models" as const;

    protected supportAnonimousCall = true;

    protected validator = getModelsValidator;

    async runDomain(input: GetModelsCommand, requestData: RequestScope): Promise<RunDomainResult<GetModelsMeta>> {
      return success(await this.moduleResolver.db.getModels());
    }

}

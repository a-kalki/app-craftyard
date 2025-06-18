import type { GetModelCommand, GetModelMeta } from "#models/domain/struct/get-model";
import type { RequestScope, RunDomainResult } from "rilata/api";
import { ModelUseCase } from "../../base-use-case";
import { getModelValidator } from "./v-map";
import { failure, success } from "rilata/core";

export class GetModelUC extends ModelUseCase<GetModelMeta> {
  arName = "ModelAr" as const;

  name = "Get Model Use Case" as const;

  inputName = "get-model" as const;

  protected supportAnonimousCall = true;

  protected validator = getModelValidator;

  async runDomain(input: GetModelCommand, requestData: RequestScope): Promise<RunDomainResult<GetModelMeta>> {
    const model = await this.moduleResolver.db.findModel(input.attrs.id);
    return model
      ? success(model)
      : failure({
        name: 'ModelDoesNotExistError',
        type: 'domain-error',
      });
  }

}

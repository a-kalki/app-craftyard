import type { GetModelCommand, GetModelMeta } from "#models/domain/struct/get-model";
import type { RequestScope, DomainResult } from "rilata/api";
import { ModelUseCase } from "../../base-uc";
import { getModelValidator } from "./v-map";
import { failure, success } from "rilata/core";

export class GetModelUC extends ModelUseCase<GetModelMeta> {
  arName = "ModelAr" as const;

  name = "Get Model Use Case" as const;

  inputName = "get-model" as const;

  protected supportAnonimousCall = true;

  protected validator = getModelValidator;

  async runDomain(input: GetModelCommand, requestData: RequestScope): Promise<DomainResult<GetModelMeta>> {
    const model = await this.moduleResolver.modelRepo.findModel(input.attrs.id);
    return model
      ? success(model)
      : failure({
        name: 'AggregateDoesNotExistError',
        type: 'domain-error',
      });
  }

}

import { QueryUseCase } from "rilata/api";
import { AssertionException, failure, success, type Caller, type Result, type UCMeta } from "rilata/core";
import type { ModelModuleResolvers } from "./types";
import type { ModelAttrs } from "#models/domain/struct/attrs";
import { ModelAr } from "#models/domain/a-root";
import type { ModelRepo } from "#models/domain/repo";
import { ModelPolicy } from "#models/domain/policy";
import type { AggregateDoesNotExistError } from "#app/domain/errors";

export abstract class ModelUseCase<META extends UCMeta> extends QueryUseCase<
  ModelModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getModelPolicy(caller: Caller, modelAttrs: ModelAttrs): ModelPolicy {
    if (caller.type === 'AnonymousUser') {
      throw new AssertionException('Not be called by anonimous user');
    }
    return new ModelPolicy(caller, modelAttrs);
  }

  getRepo(): ModelRepo {
    return this.moduleResolver.modelRepo;
  }

  async getModelAttrs(id: string): Promise<Result<AggregateDoesNotExistError, ModelAttrs>> {
    const attrs = await this.getRepo().findModel(id);
    if (!attrs) {
      return failure({
        name: 'AggregateDoesNotExistError',
        type: 'domain-error',
      });
    }
    return success(attrs);
  }

  async getModelAr(id: string): Promise<Result<AggregateDoesNotExistError, ModelAr>> {
    const res = await this.getModelAttrs(id);
    return res.isSuccess() ? success(new ModelAr(res.value)) : failure(res.value);
  }
}

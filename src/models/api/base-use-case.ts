import { QueryUseCase } from "rilata/api";
import { AssertionException, failure, success, type Caller, type Result, type UCMeta } from "rilata/core";
import type { ModelModuleResolvers } from "./types";
import type { ModelDoesNotExistError } from "#models/domain/struct/get-model";
import type { ModelAttrs } from "#models/domain/struct/attrs";
import { ModelAr } from "#models/domain/a-root";
import type { ModelRepo } from "#models/domain/repo";
import { ModelPolicy } from "#models/domain/policy";

export abstract class ModelUseCase<META extends UCMeta> extends QueryUseCase<
  ModelModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getModelPolicy(caller: Caller): ModelPolicy {
    if (caller.type === 'AnonymousUser') {
      throw new AssertionException('Not be called by anonimous user');
    }
    return new ModelPolicy(caller);
  }

  getRepo(): ModelRepo {
    return this.moduleResolver.db;
  }

  async getModelAttrs(id: string): Promise<Result<ModelDoesNotExistError, ModelAttrs>> {
    const attrs = await this.getRepo().findModel(id);
    if (!attrs) {
      return failure({
        name: 'ModelDoesNotExistError',
        type: 'domain-error',
      });
    }
    return success(attrs);
  }

  async getModelAr(id: string): Promise<Result<ModelDoesNotExistError, ModelAr>> {
    const res = await this.getModelAttrs(id);
    return res.isSuccess() ? success(new ModelAr(res.value)) : failure(res.value);
  }
}

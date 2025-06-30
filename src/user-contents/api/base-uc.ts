import { QueryUseCase, type RequestScope } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs, type Result, type UCMeta } from "rilata/core";
import type { UserContentModuleResolvers } from "./types";
import type { AggregateDoesNotExistError } from "#app/domain/errors";
import type { ThesisSetRepo } from "#user-contents/domain/thesis-set/repo";
import type { ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";
import { ThesisSetAr } from "#user-contents/domain/thesis-set/a-root";
import type { CanPerformPayload } from "rilata/api-server";

export abstract class UserContentUseCase<META extends UCMeta> extends QueryUseCase<
  UserContentModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getThesisSetRepo(): ThesisSetRepo {
    return this.moduleResolver.thesisSetRepo;
  }

  async getThesisSetAttrs(id: string): Promise<Result<AggregateDoesNotExistError, ThesisSetAttrs>> {
    const thesisSetAttrs = await this.moduleResolver.thesisSetRepo.findThesisSet(id);
    if (!thesisSetAttrs) {
      return failure({
        name: 'AggregateDoesNotExistError',
        description: 'Агрегата с таким id не существует.',
        type: 'domain-error',
      });
    }
    return success(thesisSetAttrs);
  }

  async getFileAr(id: string): Promise<Result<AggregateDoesNotExistError, ThesisSetAr>> {
    const res = await this.getThesisSetAttrs(id);
    if (res.isFailure()) return failure(res.value);
    return success(new ThesisSetAr(res.value));
  }

  async canAction(aggrData: AbstractAggregateAttrs, reqData: RequestScope): Promise<boolean> {
    if (aggrData.access === 'public') return true;

    const caller = this.getUserCaller(reqData);
    const payload: CanPerformPayload = {
      ownerAggregateAttrs: aggrData,
      action: this.inputName,
    }
    const moduleMediator = this.serverResolver.moduleMediator;
    return moduleMediator.canPerform(this.arName, payload, caller);
  }
}

import { QueryUseCase } from "rilata/api";
import { AssertionException, failure, success, type Caller, type Result, type UCMeta } from "rilata/core";
import type { AggregateDoesNotExistError } from "#app/core/errors";
import type { CooperationModuleResolvers } from "./types";
import type { CooperationAr } from "#cooperations/domain/types";
import type { CooperationRepo } from "#cooperations/domain/repo";
import { cooperationFactory } from "#cooperations/domain/factory";
import { CooperationPolicy } from "#cooperations/domain/policy";

export abstract class CooperationUseCase<META extends UCMeta> extends QueryUseCase<
  CooperationModuleResolvers, META
> {
  protected transactionStrategy!: never;

  async getCooperationPolicy(id: string, caller: Caller): Promise<CooperationPolicy> {
    if (caller.type === 'AnonymousUser') {
      throw new AssertionException('Not be called by anonimous user');
    }
    const getResult = await this.getCooperationAr(id);
    if (getResult.isFailure()) {
      throw this.logger.error(
        `[${this.constructor.name}]: not found cooperation record by id: ${id}`
      )
    }
    return new CooperationPolicy(caller, getResult.value.getAttrs());
  }

  getRepo(): CooperationRepo {
    return this.moduleResolver.cooperationRepo;
  }

  async getCooperationAr<
    AR extends CooperationAr
  >(id: string): Promise<Result<AggregateDoesNotExistError, AR>> {
    const attrs = await this.getRepo().find(id);
    return attrs
      ? success(cooperationFactory.restore(attrs) as AR)
      : failure({
        name: 'AggregateDoesNotExistError',
        type: 'domain-error',
      });
  }
}

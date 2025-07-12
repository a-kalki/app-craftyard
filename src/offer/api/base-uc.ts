import { QueryUseCase } from "rilata/api";
import { AssertionException, failure, success, type Caller, type Result, type UCMeta } from "rilata/core";
import type { AggregateDoesNotExistError } from "#app/domain/errors";
import type { OfferAr, OfferAttrs } from "#offer/domain/types";
import type { OfferModuleResolvers } from "./types";
import type { OfferRepo } from "#offer/domain/repo";
import { OfferPolicy } from "#offer/domain/policy";
import { offerFactory } from "#offer/domain/factory";

export abstract class OfferUseCase<META extends UCMeta> extends QueryUseCase<
  OfferModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getOfferPolicy(offerAttrs: OfferAttrs, caller: Caller): OfferPolicy {
    if (caller.type === 'AnonymousUser') {
      throw new AssertionException('Not be called by anonimous user');
    }
    return new OfferPolicy(caller, offerAttrs);
  }

  getRepo(): OfferRepo {
    return this.moduleResolver.offerRepo;
  }

  async getOfferAttrs(id: string): Promise<Result<AggregateDoesNotExistError, OfferAttrs>> {
    const attrs = await this.getRepo().findOffer(id);
    if (!attrs) {
      return failure({
        name: 'AggregateDoesNotExistError',
        type: 'domain-error',
      });
    }
    return success(attrs);
  }

  async getOfferAr<AR extends OfferAr>(id: string): Promise<Result<AggregateDoesNotExistError, AR>> {
    const res = await this.getOfferAttrs(id);
    return res.isSuccess()
      ? success(offerFactory.restore(res.value) as AR)
      : failure(res.value);
  }

  protected async save(attrs: OfferAttrs): Promise<{ changes: number }> {
    const repo = this.getRepo();
    const result = await repo.editOffer(attrs);
    if (result.changes !== 1) {
      throw this.logger.error(`[${this.constructor.name}]: Не удалось добавить offer`, { attrs });
    }
    return result;
  }
}

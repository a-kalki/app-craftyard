import { QueryUseCase } from "rilata/api";
import { AssertionException, failure, success, type Caller, type Result, type UCMeta } from "rilata/core";
import type { AggregateDoesNotExistError } from "#app/domain/errors";
import type { OfferAttrs } from "#offer/domain/offers";
import { BaseOfferAr } from "#offer/domain/base-offer/a-root";
import type { OfferModuleResolvers } from "./types";
import type { OfferRepo } from "#offer/domain/base-offer/repo";
import type { BaseOfferArMeta } from "#offer/domain/base-offer/meta";

export abstract class OfferUseCase<META extends UCMeta> extends QueryUseCase<
  OfferModuleResolvers, META
> {
  protected transactionStrategy!: never;

  getOfferPolicy(caller: Caller, offerAttrs: OfferAttrs): OfferPolicy {
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

  async getOfferAr(id: string): Promise<Result<AggregateDoesNotExistError, BaseOfferAr<BaseOfferArMeta>>> {
    const res = await this.getOfferAttrs(id);
    return res.isSuccess() ? success(new BaseOfferAr(res.value)) : failure(res.value);
  }
}

import { JsonRepository } from "#app/infra/json-repo";
import type { OfferRepo } from "#offer/domain/base-offer/repo";
import type { OfferAttrs } from "#offer/domain/offers";
import type { MaybePromise } from "rilata/core";

const repoPath = import.meta.dir + '/offers.json';

export class OfferJsonRepo implements OfferRepo {
  protected jsonRepo = new JsonRepository<OfferAttrs>(repoPath);

  findOffer(id: string): MaybePromise<OfferAttrs | undefined> {
    return this.jsonRepo.find(id);
  }
  filterOffers(attrs: Partial<OfferAttrs>): MaybePromise<OfferAttrs[]> {
    return this.jsonRepo.filter(attrs);
  }
  getOffers(): MaybePromise<OfferAttrs[]> {
    return this.jsonRepo.filter({});
  }

}

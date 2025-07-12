import { JsonRepository } from "#app/infra/json-repo";
import type { OfferRepo } from "#offer/domain/repo";
import type { OfferAttrs } from "#offer/domain/types";
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

  addOffer(attrs: OfferAttrs): MaybePromise<{ changes: number; }> {
    return this.jsonRepo.update(attrs.id, attrs)
      .then(() => ({ changes: 1 }));
    
  }
  editOffer(attrs: OfferAttrs): MaybePromise<{ changes: number; }> {
    return this.jsonRepo.update(attrs.id, attrs)
      .then(() => ({ changes: 1 }));
  }

  getWorkshopOffers(organizationId: string): MaybePromise<OfferAttrs[]> {
    return this.jsonRepo.filter({ organizationId });
  }
    
  getMasterOffers(masterId: string): MaybePromise<OfferAttrs[]> {
    return this.jsonRepo.filter({ masterId });
  }
}

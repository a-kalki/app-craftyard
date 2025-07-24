import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";
import { BaseBackendApi } from "#app/ui/base/base-api";
import type { OfferAttrs } from "#offer/domain/types";
import type { GetOfferCommand, GetOfferMeta } from "#offer/domain/crud/get-offer/contract";
import type { GetWorkshopOffersCommand, GetWorkshopOffersMeta, GetWorkshopOffersSuccess } from "#offer/domain/crud/get-workshop-offers/contract";
import type { GetMasterOffersCommand, GetMasterOffersMeta, GetMasterOffersSuccess } from "#offer/domain/crud/get-master-offers/contract";
import type { AddOfferCommand, AddOfferMeta } from "#offer/domain/crud/add-offer/contract";
import type { EditOfferCommand, EditOfferMeta } from "#offer/domain/crud/edit-offer/contract";
import { offerApiUrl } from "#offer/constants";
import type { DeleteOfferCommand, DeleteOfferMeta } from "#offer/domain/crud/delete-offer/contract";
import type { GetOffersCommand, GetOffersMeta } from "#offer/domain/crud/get-offers/contract";

export class OffersBackendApi extends BaseBackendApi<OfferAttrs> {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(offerApiUrl, jwtDecoder, cacheTtlAsMin);
  }

  async getOffer(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetOfferMeta>> {
    const cached = this.getFromCacheById(id, forceRefresh);
    if (cached) return success(cached);
    const command: GetOfferCommand = {
      name: 'get-offer',
      attrs: { id },
      requestId: crypto.randomUUID(),
    };
    const result = await this.request<GetOfferMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(id ,result.value);
    }
    return result;
  }

  async getWorkshopOffers(
    workshopId: string, forceRefresh?: boolean,
  ): Promise<BackendResultByMeta<GetWorkshopOffersMeta>> {
    const cacheKey = 'workshop-offers';
    const cached = this.getOtherFromCacheById(workshopId, cacheKey, forceRefresh);
    if (cached) return success(cached as GetWorkshopOffersSuccess);

    const command: GetWorkshopOffersCommand = {
      name: 'get-workshop-offers',
      attrs: { organizationId: workshopId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetWorkshopOffersMeta>(command);
    if (result.isSuccess()) {
      this.setOtherCacheById(workshopId, result.value, cacheKey);
      result.value.forEach(offer => this.setCacheById(offer.id, offer));
    }
    return result;
  }

  async getMasterOffers(
    masterId: string, forceRefresh?: boolean,
  ): Promise<BackendResultByMeta<GetMasterOffersMeta>> {
    const cacheKey = 'master-offers';
    const cached = this.getOtherFromCacheById(masterId, cacheKey, forceRefresh);

    if (cached) return success(cached as GetMasterOffersSuccess);
    const command: GetMasterOffersCommand = {
      name: 'get-master-offers',
      attrs: { masterId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetMasterOffersMeta>(command);
    if (result.isSuccess()) {
      this.setOtherCacheById(masterId, result.value, cacheKey);
      result.value.forEach(offer => this.setCacheById(offer.id, offer));
    }
    return result;
  }

  async getOffers(
    attrs: GetOffersCommand['attrs'],
  ): Promise<BackendResultByMeta<GetOffersMeta>> {
    const command: GetOffersCommand = {
      name: 'get-offers',
      attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetOffersMeta>(command);
    if (result.isSuccess()) {
      result.value.forEach(offer => this.setCacheById(offer.id, offer));
    }
    return result;
  }

  async addOffer( attrs: AddOfferCommand['attrs']): Promise<BackendResultByMeta<AddOfferMeta>> {
    const command: AddOfferCommand = {
      name: "add-offer",
      attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<AddOfferMeta>(command);
    if (result.isSuccess()) {
      this.clearCache();
    }
    return result;
  }

  async editOffer( attrs: EditOfferCommand['attrs']): Promise<BackendResultByMeta<EditOfferMeta>> {
    const command: EditOfferCommand = {
      name: 'edit-offer',
      attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<EditOfferMeta>(command);
    if (result.isSuccess()) {
      this.clearCache();
    }
    return result;
  }

  async deleteOffer(offerId: string): Promise<BackendResultByMeta<DeleteOfferMeta>> {
    const command: DeleteOfferCommand = {
      name: 'delete-offer',
      attrs: { offerId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<DeleteOfferMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(offerId);
    }
    return result;
  }
}

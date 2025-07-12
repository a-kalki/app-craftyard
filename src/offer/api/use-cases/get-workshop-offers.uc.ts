import type { GetWorkshopOffersCommand, GetWorkshopOffersMeta } from "#offer/domain/crud/get-workshop-offers/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { OfferUseCase } from "../base-uc";
import { getOfferWorkshopValidator } from "#offer/domain/crud/get-workshop-offers/v-map";
import { success } from "rilata/core";

export class GetWorkshopOffersUseCase extends OfferUseCase<GetWorkshopOffersMeta> {
  arName = "BaseOfferAr" as const;

  name = "Get Workshop Offers Case" as const;

  inputName = "get-workshop-offers" as const;

  protected supportAnonimousCall = true;

  protected validator = getOfferWorkshopValidator;

  async runDomain(
    input: GetWorkshopOffersCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetWorkshopOffersMeta>> {
    return success(
      await this.getRepo().getWorkshopOffers(input.attrs.organizationId)
    );
  }
}

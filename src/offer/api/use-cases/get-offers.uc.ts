import type { GetOffersCommand, GetOffersMeta } from "#offer/domain/crud/get-offers/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { OfferUseCase } from "../base-uc";
import { getOffersValidator } from "#offer/domain/crud/get-offers/v-map";
import { success } from "rilata/core";

export class GetOffersUseCase extends OfferUseCase<GetOffersMeta> {
  arName = "BaseOfferAr" as const;

  name = "Get Offers Case" as const;

  inputName = "get-offers" as const;

  protected supportAnonimousCall = true;

  protected validator = getOffersValidator;

  async runDomain(input: GetOffersCommand, reqScope: RequestScope): Promise<DomainResult<GetOffersMeta>> {
    return success(await this.getRepo().getOffers(input.attrs));
  }
}

import type { GetMasterOffersCommand, GetMasterOffersMeta } from "#offer/domain/crud/get-master-offers/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { OfferUseCase } from "../base-uc";
import { getMasterOffersValidator } from "#offer/domain/crud/get-master-offers/v-map";
import { success } from "rilata/core";

export class GetMasterOffersUseCase extends OfferUseCase<GetMasterOffersMeta> {
  arName = "BaseOfferAr" as const;

  name = "Get Master Offers Case" as const;

  inputName = "get-master-offers" as const;

  protected supportAnonimousCall = true;

  protected validator = getMasterOffersValidator;

  async runDomain(
    input: GetMasterOffersCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetMasterOffersMeta>> {
    return success(
      await this.getRepo().getMasterOffers(input.attrs.masterId)
    );
  }
}

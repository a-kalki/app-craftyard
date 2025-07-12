import type { GetOfferCommand, GetOfferMeta } from "#offer/domain/crud/get-offer/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { OfferUseCase } from "../base-uc";
import { getOfferValidator } from "#offer/domain/crud/get-offer/v-map";

export class GetOfferUseCase extends OfferUseCase<GetOfferMeta> {
  arName = "BaseOfferAr" as const;

  name = "Get Offer Case" as const;

  inputName = "get-offer" as const;

  protected supportAnonimousCall = true;

  protected validator = getOfferValidator;

  runDomain(input: GetOfferCommand, reqScope: RequestScope): Promise<DomainResult<GetOfferMeta>> {
    return this.getOfferAttrs(input.attrs.id);
  }
}

import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetWorkshopOffersCommand } from "./contract";
import { offerAttrsVmap } from "#offer/domain/base-offer/struct/v-map";

const getOfferWorkshopVmap: ValidatorMap<GetWorkshopOffersCommand['attrs']> = {
  organizationId: offerAttrsVmap.organizationId
}

export const getOfferWorkshopValidator = new DtoFieldValidator(
  'get-workshop-offers', true, { isArray: false }, 'dto', getOfferWorkshopVmap
)

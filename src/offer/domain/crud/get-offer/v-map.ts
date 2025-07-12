import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetOfferCommand } from "./contract";
import { offerAttrsVmap } from "#offer/domain/base-offer/struct/v-map";

const getOfferVmap: ValidatorMap<GetOfferCommand['attrs']> = {
  id: offerAttrsVmap.id
}

export const getOfferValidator = new DtoFieldValidator(
  'get-offer', true, { isArray: false }, 'dto', getOfferVmap
)

import { offerAttrsVmap } from "#offer/domain/base-offer/struct/v-map";
import type { DeleteOfferCommand } from "./contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const deleteOfferVmap: ValidatorMap<DeleteOfferCommand['attrs']> = {
  offerId: offerAttrsVmap.id.cloneWithName('offerId'),
}

export const deleteOfferValidator = new DtoFieldValidator(
  'delete-offer', true, { isArray: false }, 'dto', deleteOfferVmap
)


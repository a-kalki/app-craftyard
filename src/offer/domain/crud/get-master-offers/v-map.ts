import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetMasterOffersCommand } from "./contract";
import { modelCreateionOfferVmap } from "#offer/domain/base-offer/struct/v-map";

const getMasterOffersVmap: ValidatorMap<GetMasterOffersCommand['attrs']> = {
  masterId: modelCreateionOfferVmap.masterId
}

export const getMasterOffersValidator = new DtoFieldValidator(
  'get-master-offers', true, { isArray: false }, 'dto', getMasterOffersVmap
)

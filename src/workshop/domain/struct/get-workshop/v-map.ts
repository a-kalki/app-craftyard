import type { GetWorkshopCommand } from "./contract";
import { workshopVmap } from "#workshop/domain/struct/v-map"
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator"

const getWorkshopVmap: ValidatorMap<GetWorkshopCommand['attrs']> = {
  id: workshopVmap.id,
}

export const getWorkshopValidator = new DtoFieldValidator(
  'get-workshop', true, { isArray: false }, 'dto', getWorkshopVmap,
)

import type { GetWorkshopCommand } from "#workshop/domain/struct/get-workshop"
import { workshopVmap } from "#workshop/domain/v-map"
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator"

const getWorkshopVmap: ValidatorMap<GetWorkshopCommand['attrs']> = {
  id: workshopVmap.id,
}

export const getWorkshopValidator = new DtoFieldValidator(
  'get-workshop', true, { isArray: false }, 'dto', getWorkshopVmap,
)

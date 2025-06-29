import { uuidFieldValidator } from "#app/domain/base-validators";
import type { GetOwnerArThesisSetsCommand } from "#user-contents/domain/thesis-set/struct/thesis-set/get-owner-ar-sets";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getOwnerArThesisSetsVmap: ValidatorMap<GetOwnerArThesisSetsCommand['attrs']> = {
  ownerId: uuidFieldValidator.cloneWithName('ownerId'),
}

export const getOwnerArThesisSetsValidator = new DtoFieldValidator(
  'get-owner-ar-thesis-sets', true, { isArray: false }, 'dto', getOwnerArThesisSetsVmap
)

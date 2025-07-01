import { uuidFieldValidator } from "#app/domain/base-validators";
import type { GetOwnerArContentSectionsCommand } from "#user-contents/domain/section/struct/get-owner-ar-sets";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getOwnerArContentSectionsVmap: ValidatorMap<GetOwnerArContentSectionsCommand['attrs']> = {
  ownerId: uuidFieldValidator.cloneWithName('ownerId'),
}

export const getOwnerArContentSectionsValidator = new DtoFieldValidator(
  'get-owner-ar-content-sections', true, { isArray: false }, 'dto', getOwnerArContentSectionsVmap
)

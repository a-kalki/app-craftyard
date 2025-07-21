import { contentSectionVmap } from "../v-map";
import type { GetOwnerArContentSectionsCommand } from "./contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

const getOwnerArContentSectionsVmap: ValidatorMap<GetOwnerArContentSectionsCommand['attrs']> = {
  ownerId: contentSectionVmap.ownerId,
}

export const getOwnerArContentSectionsValidator = new DtoFieldValidator(
  'get-owner-ar-content-sections', true, { isArray: false }, 'dto', getOwnerArContentSectionsVmap
)

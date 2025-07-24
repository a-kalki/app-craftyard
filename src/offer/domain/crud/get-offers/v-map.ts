import { DtoFieldValidator, LiteralFieldValidator, type ValidatorMap } from "rilata/validator";
import type { GetOffersCommand } from "./contract";
import { offerAttrsVmap } from "#offer/domain/base-offer/struct/v-map";

const getOffersVmap: ValidatorMap<GetOffersCommand['attrs']> = {
  id: offerAttrsVmap.id.cloneWithRequired(false),
  title: offerAttrsVmap.title.cloneWithRequired(false),
  description: offerAttrsVmap.description.cloneWithRequired(false),
  organizationId: offerAttrsVmap.organizationId.cloneWithRequired(false),
  offerCooperationId: offerAttrsVmap.offerCooperationId.cloneWithRequired(false),
  cost: offerAttrsVmap.cost.cloneWithRequired(false),
  status: offerAttrsVmap.status.cloneWithRequired(false),
  editorIds: offerAttrsVmap.editorIds.cloneWithRequired(false),
  createAt: offerAttrsVmap.createAt.cloneWithRequired(false),
  updateAt: offerAttrsVmap.updateAt.cloneWithRequired(false),
  type: new LiteralFieldValidator(
    'type', false, { isArray: false }, 'string', []
  ),
}

export const getOffersValidator = new DtoFieldValidator(
  'get-offers', true, { isArray: false }, 'dto', getOffersVmap
)

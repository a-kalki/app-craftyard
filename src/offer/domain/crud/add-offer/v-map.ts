import type { AddWorkspaceRentAttrs, AddHobbyKitAttrs } from "./contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import { hobbyKitOfferVmap } from "#offer/domain/hobby-kit/struct/v-map";
import { workspaceRentOfferVmap } from "#offer/domain/workspace-rent/struct/v-map";

export const addHobbyKitContentVmap: ValidatorMap<AddHobbyKitAttrs> = {
  title: hobbyKitOfferVmap.title,
  description: hobbyKitOfferVmap.description,
  cost: hobbyKitOfferVmap.cost,
  modelId: hobbyKitOfferVmap.modelId,
  type: hobbyKitOfferVmap.type,
  workshopOfferId: hobbyKitOfferVmap.workshopOfferId,
  materialPreparationHours: hobbyKitOfferVmap.materialPreparationHours,
  organizationId: hobbyKitOfferVmap.organizationId,
  offerCooperationId: hobbyKitOfferVmap.offerCooperationId,
  masterId: hobbyKitOfferVmap.masterId
}

export const addHobbyKitContentValidator = new DtoFieldValidator(
  'add-hobby-kit', true, { isArray: false }, 'dto', addHobbyKitContentVmap
)

export const addWorkspaceRentVmap: ValidatorMap<AddWorkspaceRentAttrs> = {
  type: workspaceRentOfferVmap.type,
  title: workspaceRentOfferVmap.title,
  description: workspaceRentOfferVmap.description,
  cost: workspaceRentOfferVmap.cost,
  accessHours: workspaceRentOfferVmap.accessHours,
  mastersDiscount: workspaceRentOfferVmap.mastersDiscount,
  organizationId: workspaceRentOfferVmap.organizationId,
  offerCooperationId: workspaceRentOfferVmap.offerCooperationId,
}

export const addWorkspaceRentValidator = new DtoFieldValidator(
  'add-workspace-rent', true, { isArray: false }, 'dto', addWorkspaceRentVmap
)

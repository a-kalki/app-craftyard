import type { EditHobbyKitAttrs, EditWorkspaceRentAttrs } from "./contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";
import { hobbyKitOfferVmap } from "#offer/domain/hobby-kit/struct/v-map";
import { workspaceRentOfferVmap } from "#offer/domain/workspace-rent/struct/v-map";

export const editHobbyKitContentVmap: ValidatorMap<EditHobbyKitAttrs> = {
  id: hobbyKitOfferVmap.id,
  title: hobbyKitOfferVmap.title,
  type: hobbyKitOfferVmap.type,
  description: hobbyKitOfferVmap.description,
  offerCooperationId: hobbyKitOfferVmap.offerCooperationId,
  cost: hobbyKitOfferVmap.cost,
  estimatedExpenses: hobbyKitOfferVmap.estimatedExpenses,
  workspaceRentOfferId: hobbyKitOfferVmap.workspaceRentOfferId,
  materialPreparationHours: hobbyKitOfferVmap.materialPreparationHours,
}

export const editHobbyKitContentValidator = new DtoFieldValidator(
  'edit-hobby-kit', true, { isArray: false }, 'dto', editHobbyKitContentVmap
)

export const workspaceRentType: WorkspaceRentOfferAttrs['type'] = 'WORKSPACE_RENT_OFFER';

export const editWorkspaceRentVmap: ValidatorMap<EditWorkspaceRentAttrs> = {
  id: workspaceRentOfferVmap.id,
  title: workspaceRentOfferVmap.title,
  type: workspaceRentOfferVmap.type,
  description: workspaceRentOfferVmap.description,
  offerCooperationId: workspaceRentOfferVmap.offerCooperationId,
  cost: workspaceRentOfferVmap.cost,
  accessHours: workspaceRentOfferVmap.accessHours,
  mastersDiscount: workspaceRentOfferVmap.mastersDiscount,
}

export const editWorkspaceRentValidator = new DtoFieldValidator(
  'edit-workspace-rent', true, { isArray: false }, 'dto', editWorkspaceRentVmap
)

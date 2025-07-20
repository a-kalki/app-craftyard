import type { AddWorkspaceRentOfferAttrs, AddHobbyKitOfferAttrs, AddProductSaleOfferAttrs, AddCourseOfferAttrs } from "./contract";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";
import { hobbyKitOfferVmap } from "#offer/domain/hobby-kit/struct/v-map";
import { workspaceRentOfferVmap } from "#offer/domain/workspace-rent/struct/v-map";
import { productSaleOfferVmap } from "#offer/domain/product-sale/struct/v-map";
import { courseOfferVmap } from "#offer/domain/course/struct/v-map";

export const addHobbyKitOfferVmap: ValidatorMap<AddHobbyKitOfferAttrs> = {
  title: hobbyKitOfferVmap.title,
  description: hobbyKitOfferVmap.description,
  cost: hobbyKitOfferVmap.cost,
  modelId: hobbyKitOfferVmap.modelId,
  type: hobbyKitOfferVmap.type,
  workspaceRentOfferId: hobbyKitOfferVmap.workspaceRentOfferId,
  materialPreparationHours: hobbyKitOfferVmap.materialPreparationHours,
  organizationId: hobbyKitOfferVmap.organizationId,
  offerCooperationId: hobbyKitOfferVmap.offerCooperationId,
  masterId: hobbyKitOfferVmap.masterId
}

export const addHobbyKitOfferValidator = new DtoFieldValidator(
  'add-hobby-kit', true, { isArray: false }, 'dto', addHobbyKitOfferVmap
)

export const addWorkspaceRentOfferVmap: ValidatorMap<AddWorkspaceRentOfferAttrs> = {
  type: workspaceRentOfferVmap.type,
  title: workspaceRentOfferVmap.title,
  description: workspaceRentOfferVmap.description,
  cost: workspaceRentOfferVmap.cost,
  accessHours: workspaceRentOfferVmap.accessHours,
  mastersDiscount: workspaceRentOfferVmap.mastersDiscount,
  organizationId: workspaceRentOfferVmap.organizationId,
  offerCooperationId: workspaceRentOfferVmap.offerCooperationId,
}

export const addWorkspaceRentOfferValidator = new DtoFieldValidator(
  'add-workspace-rent', true, { isArray: false }, 'dto', addWorkspaceRentOfferVmap
)

export const addProductSaleOfferVmap: ValidatorMap<AddProductSaleOfferAttrs> = {
  title: productSaleOfferVmap.title,
  description: productSaleOfferVmap.description,
  organizationId: productSaleOfferVmap.organizationId,
  offerCooperationId: productSaleOfferVmap.offerCooperationId,
  cost: productSaleOfferVmap.cost,
  modelId: productSaleOfferVmap.modelId,
  masterId: productSaleOfferVmap.masterId,
  type: productSaleOfferVmap.type,
  productionTimeDays: productSaleOfferVmap.productionTimeDays
}

export const addProductSaleOfferValidator = new DtoFieldValidator(
  'add-product-sale', true, { isArray: false }, 'dto', addProductSaleOfferVmap
)

export const addCourseOfferVmap: ValidatorMap<AddCourseOfferAttrs> = {
  title: courseOfferVmap.title,
  description: courseOfferVmap.description,
  organizationId: courseOfferVmap.organizationId,
  offerCooperationId: courseOfferVmap.offerCooperationId,
  cost: courseOfferVmap.cost,
  modelId: courseOfferVmap.modelId,
  masterId: courseOfferVmap.masterId,
  type: courseOfferVmap.type,
  durationDays: courseOfferVmap.durationDays,
  activeWorkshopHours: courseOfferVmap.activeWorkshopHours,
  minStudents: courseOfferVmap.minStudents,
  maxStudents: courseOfferVmap.maxStudents
}

export const addCourseOfferValidator = new DtoFieldValidator(
  'add-course', true, { isArray: false }, 'dto', addCourseOfferVmap
);

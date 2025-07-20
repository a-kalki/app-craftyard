import {
  DtoFieldValidator, LiteralFieldValidator, RangeNumberValidationRule,
  StringChoiceValidationRule, type ValidatorMap,
} from "rilata/validator";
import type { ExpenseItem, ModelOfferAttrs, BaseOfferAttrs, OfferStatus } from "./attrs";
import {
  createAtValidator, descriptionValidator, editorIdsValidator, ownerIdValidator,
  titleValidator, updateAtValidator, uuidFieldValidator,
} from "#app/domain/base-validators";
import { costValidator } from "#app/domain/v-map";
import type { UnionToTuple } from "rilata/core";
import { modelAttrsVmap } from "#models/domain/struct/v-map";
import { workshopVmap } from "#workshop/domain/struct/v-map";

export const offerStatuses: UnionToTuple<OfferStatus> = ['active', 'archived', 'pending_moderation'];

export const expensesVMap: ValidatorMap<ExpenseItem> = {
  title: titleValidator,
  description: descriptionValidator.cloneWithRequired(false),
  amount: new LiteralFieldValidator('amount', true, { isArray: false }, 'number', [
    new RangeNumberValidationRule(0, 100),
  ]),
}

export const offerAttrsVmap: ValidatorMap<BaseOfferAttrs> = {
  id: uuidFieldValidator,
  title: titleValidator,
  description: descriptionValidator,
  organizationId: workshopVmap.id.cloneWithName('organizationId'),
  offerCooperationId: uuidFieldValidator.cloneWithName('offerCooperationId'),
  cost: costValidator,
  status: new LiteralFieldValidator('status', true, { isArray: false }, 'string', [
      new StringChoiceValidationRule(offerStatuses),
  ]),
  editorIds: editorIdsValidator,
  createAt: createAtValidator,
  updateAt: updateAtValidator
}

export const modelCreateionOfferVmap: ValidatorMap<ModelOfferAttrs> = {
  ...offerAttrsVmap,
  modelId: modelAttrsVmap.id.cloneWithName('modelId'),
  masterId: ownerIdValidator.cloneWithName('masterId'),
  estimatedExpenses: new DtoFieldValidator('estimatedExpenses', true, { isArray: true }, 'dto', expensesVMap),
}

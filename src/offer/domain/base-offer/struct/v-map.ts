import { DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule, RangeNumberValidationRule, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator";
import type { ExpenseItem, ModelCreationOfferAttrs, BaseOfferAttrs, OfferStatus } from "./attrs";
import { descriptionValidator, editorIdsValidator, ownerIdValidator, titleValidator, uuidFieldValidator } from "#app/domain/base-validators";
import { costValidator } from "#app/domain/v-map";
import type { UnionToTuple } from "rilata/core";
import { modelAttrsVmap } from "#models/domain/struct/v-map";
import { workshopVmap } from "#workshop/domain/struct/v-map";

export const offerStatuses: UnionToTuple<OfferStatus> = ['active', 'archived', 'pending_moderation'];

export const expensesVMap: ValidatorMap<ExpenseItem> = {
  name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Имя должно состоять не менее чем из 5 символов.'),
  ]),
  amount: new LiteralFieldValidator('amount', true, { isArray: false }, 'number', [
    new RangeNumberValidationRule(0, 100),
  ]),
}

export const offerAttrsVmap: ValidatorMap<BaseOfferAttrs> = {
    id: uuidFieldValidator,
    title: titleValidator,
    description: descriptionValidator,
    workshopId: workshopVmap.id.cloneWithName('workshopId'),
    cost: costValidator,
    status: new LiteralFieldValidator('status', true, { isArray: false }, 'string', [
        new StringChoiceValidationRule(offerStatuses),
    ]),
    estimatedExpenses: new DtoFieldValidator('estimatedExpenses', true, { isArray: true }, 'dto', expensesVMap),
    offerParticipantId: uuidFieldValidator.cloneWithName('offerParticipantId'),
    editorIds: editorIdsValidator,
}

export const modelCreateionOfferVmap: ValidatorMap<ModelCreationOfferAttrs> = {
  ...offerAttrsVmap,
  modelId: modelAttrsVmap.id.cloneWithName('modelId'),
  ownerId: ownerIdValidator,
}

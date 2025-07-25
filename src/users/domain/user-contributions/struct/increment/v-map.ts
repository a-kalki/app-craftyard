import { DtoFieldValidator, StringChoiceFieldValidator, type ValidatorMap } from "rilata/validator";
import type { IncrementContributionAttrs } from "./contract";
import { userIdValidator } from "#app/core/base-validators";
import { USER_CONTRIBUTION_KEYS } from "../../constants";

export const incrementContributionVmap: ValidatorMap<IncrementContributionAttrs> = {
  userId: userIdValidator.cloneWithName('userId'),
  key: new StringChoiceFieldValidator('key', true, { isArray: false }, USER_CONTRIBUTION_KEYS)
}

export const incrementContributionValidator = new DtoFieldValidator(
  'increment-user-contribution', true, { isArray: false }, 'dto', incrementContributionVmap
)

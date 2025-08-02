import {
  DtoFieldValidator, LiteralFieldValidator, StringChoiceValidationRule, type ValidatorMap,
} from "rilata/validator";
import type { AppAboutContentType, GetAppAboutContentCommand } from "./contract";
import type { UnionToTuple } from "rilata/core";

export const getAppAboutContentTypes: UnionToTuple<AppAboutContentType> = [
  'general',
  'actor',
  'entity',
  'contribution',
  'monetization',
  'roadmap',
]

export const getAppAboutContentVmap: ValidatorMap<GetAppAboutContentCommand['attrs']> = {
  contentType: new LiteralFieldValidator(
    'contentType', true, { isArray: false }, 'string', [
      new StringChoiceValidationRule(getAppAboutContentTypes),
    ]
  ),
}

export const getAppAboutContentValidator = new DtoFieldValidator(
  'get-app-about-content', true, { isArray: false }, 'dto', getAppAboutContentVmap
)

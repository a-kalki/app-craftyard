import { DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule, PositiveNumberValidationRule, StrictEqualFieldValidator, StringChoiceValidationRule, type ValidatorMap } from "rilata/validator";
import type { ContentAttrs } from "./struct/attrs";
import { shoelaceIconValidator, createAtValidator, updateAtValidator, uuidFieldValidator, descriptionValidator, uuidRule } from "#app/domain/base-validators";
import type { ThesisContent } from "./struct/thesis-attrs";
import type { DTO, UnionToTuple } from "rilata/core";
import type { FileContent, FileType } from "./struct/file-attrs";
import type { ImagesContent } from "./struct/images-attrs";

export const userContentVmap: ValidatorMap<ContentAttrs> = {
  id: uuidFieldValidator,
  sectionId: uuidFieldValidator.cloneWithName('sectionId'),
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', []),
  title: new LiteralFieldValidator('title', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Название должно содержать не менее 5 символов'),
  ]),
  footer: new LiteralFieldValidator('footer', false, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Футер должен содержать не менее 10 символов'),
  ]),
  order: new LiteralFieldValidator('order', false, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  icon: shoelaceIconValidator.cloneWithRequired(false),
  createAt: createAtValidator,
  updateAt: updateAtValidator,
}

// ++++++++++++++ thesis ++++++++++++++++
export const thesisContentType: ThesisContent['type'] = 'THESIS';

export const thesisVmap: ValidatorMap<ThesisContent> = {
  ...userContentVmap,
  type: new StrictEqualFieldValidator('type', thesisContentType),
  body: new LiteralFieldValidator('body', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(10, 'Тезис должен содержать не менее 10 символов'),
  ]),
}

export const thesisContentValidator = new DtoFieldValidator<string, true, false, DTO>(
  'thesisContent', true, { isArray: false }, 'dto', thesisVmap,
)

// ++++++++++++++ file ++++++++++++++++
export const fileContentType: FileContent['type'] = 'FILE';

export const fileTypes: UnionToTuple<FileType> = ['PDF', 'VIDEO'];

export const fileContentVmap: ValidatorMap<FileContent> = {
  ...userContentVmap,
  type: new StrictEqualFieldValidator('type', fileContentType),
  description: new LiteralFieldValidator('description', false, { isArray: false }, 'string', []),
  fileId: uuidFieldValidator.cloneWithName('fileId'),
  fileType: new LiteralFieldValidator('fileType', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(fileTypes)
  ]),
  thumbnailId: new LiteralFieldValidator('thumbnailId', false, { isArray: false }, 'string', []),
}

export const fileContentValidator = new DtoFieldValidator<string, true, false, DTO>(
  'fileContent', true, { isArray: false }, 'dto', fileContentVmap,
)


// ++++++++++++++ images ++++++++++++++++
export const imagesContentType: ImagesContent['type'] = 'IMAGES';

export const imagesVmap: ValidatorMap<ImagesContent> = {
  ...userContentVmap,
  type: new StrictEqualFieldValidator('type', imagesContentType),
  description: descriptionValidator.cloneWithRequired(false),
  imageIds: new LiteralFieldValidator(
    'imageIds', true, { isArray: true }, 'string', [uuidRule]
  )

  //body: new LiteralFieldValidator('body', true, { isArray: false }, 'string', [
  //  new MinCharsCountValidationRule(10, 'Тезис должен содержать не менее 10 символов'),
  //]),
}

export const imagesContentValidator = new DtoFieldValidator<string, true, false, DTO>(
  'imagesContent', true, { isArray: false }, 'dto', imagesVmap,
)

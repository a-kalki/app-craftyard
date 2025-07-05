import {
  DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule, type ValidatorMap,
} from "rilata/validator";
import { createAtValidator, descriptionValidator, editorIdsValidator, titleValidator, updateAtValidator, uuidFieldValidator } from "#app/domain/base-validators";
import type { WorkshopAbout, WorkshopAttrs } from "./attrs";

const workshopAbout: ValidatorMap<WorkshopAbout> = {
  logo: new LiteralFieldValidator('logo', false, { isArray: false }, 'string', []),
  location: new LiteralFieldValidator('location', true, { isArray: false }, 'string', [
    new MinCharsCountValidationRule(5, 'Местоположение должно содержать не менее 5 символов'),
  ]),
}

export const workshopVmap: ValidatorMap<WorkshopAttrs> = {
    id: uuidFieldValidator,
    title: titleValidator,
    description: descriptionValidator,
    about: new DtoFieldValidator('about', true, { isArray: false }, 'dto', workshopAbout),
    editorIds: editorIdsValidator,
    createAt: createAtValidator,
    updateAt: updateAtValidator
}

export const workshopValidator = new DtoFieldValidator(
  'WorkshopAr', true, { isArray: false }, 'dto', workshopVmap,
)

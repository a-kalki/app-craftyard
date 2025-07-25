import {
  DtoFieldValidator, LiteralFieldValidator, MinCharsCountValidationRule, type ValidatorMap,
} from "rilata/validator";
import {
  createAtValidator, descriptionValidator, editorIdsValidator, titleValidator,
  updateAtValidator, uuidFieldValidator,
}from "#app/core/base-validators";
import type { OrganizationAbout, WorkshopAttrs } from "./attrs";

const workshopAbout: ValidatorMap<OrganizationAbout> = {
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
    employeeIds: editorIdsValidator.cloneWithName('employeeIds'),
    masterIds: editorIdsValidator.cloneWithName('masterIds'),
    mentorIds: editorIdsValidator.cloneWithName('mentorIds'),
    createAt: createAtValidator,
    updateAt: updateAtValidator
}

export const workshopValidator = new DtoFieldValidator(
  'WorkshopAr', true, { isArray: false }, 'dto', workshopVmap,
)

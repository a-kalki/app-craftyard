import type { AddFileContentAttrs, AddImagesContentAttrs, AddThesisAttrs } from "./contract";
import { fileContentVmap, imagesVmap, thesisVmap } from "#user-contents/domain/content/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const addThesisContentVmap: ValidatorMap<AddThesisAttrs> = {
  sectionId: thesisVmap.sectionId,
  type: thesisVmap.type,
  title: thesisVmap.title,
  body: thesisVmap.body,
  footer: thesisVmap.footer,
  order: thesisVmap.order,
  icon: thesisVmap.icon,
}

export const addThesisContentValidator = new DtoFieldValidator(
  'add-thesis-content', true, { isArray: false }, 'dto', addThesisContentVmap
)

export const addFileContentVmap: ValidatorMap<AddFileContentAttrs> = {
  sectionId: fileContentVmap.sectionId,
  type: fileContentVmap.type,
  title: fileContentVmap.title,
  order: fileContentVmap.order,
  icon: fileContentVmap.icon,
  description: fileContentVmap.description,
  fileId: fileContentVmap.fileId,
  fileType: fileContentVmap.fileType,
  thumbnailId: fileContentVmap.thumbnailId,
  footer: fileContentVmap.footer
}

export const addFileContentValidator = new DtoFieldValidator(
  'add-file-content', true, { isArray: false }, 'dto', addFileContentVmap
)

export const addImagesContentVmap: ValidatorMap<AddImagesContentAttrs> = {
  sectionId: imagesVmap.sectionId,
  type: imagesVmap.type,
  title: imagesVmap.title,
  footer: imagesVmap.footer,
  order: imagesVmap.order,
  icon: imagesVmap.icon,
  description: imagesVmap.description,
  imageIds: imagesVmap.imageIds
}

export const addImagesContentValidator = new DtoFieldValidator(
  'add-images-content', true, { isArray: false }, 'dto', addImagesContentVmap
)

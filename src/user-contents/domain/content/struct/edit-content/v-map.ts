import type { EditFileContentAttrs, EditImagesContentAttrs, EditThesistAttrs } from "#user-contents/domain/content/struct/edit-content/contract";
import { fileContentVmap, imagesVmap, thesisVmap } from "#user-contents/domain/content/v-map";
import { DtoFieldValidator, type ValidatorMap } from "rilata/validator";

export const editThesisContentVmap: ValidatorMap<EditThesistAttrs> = {
  id: thesisVmap.id,
  sectionId: thesisVmap.sectionId,
  type: thesisVmap.type,
  title: thesisVmap.title,
  order: thesisVmap.order,
  icon: thesisVmap.icon,
  body: thesisVmap.body,
  footer: thesisVmap.footer,
}

export const editThesisContentValidator = new DtoFieldValidator(
  'edit-file-content', true, { isArray: false }, 'dto', editThesisContentVmap
)

export const editFileContentVmap: ValidatorMap<EditFileContentAttrs> = {
  id: fileContentVmap.id,
  sectionId: fileContentVmap.sectionId,
  type: fileContentVmap.type,
  title: fileContentVmap.title,
  footer: fileContentVmap.footer,
  description: fileContentVmap.description,
  order: fileContentVmap.order,
  icon: fileContentVmap.icon,
  fileId: fileContentVmap.fileId,
  fileType: fileContentVmap.fileType,
  thumbnailId: fileContentVmap.thumbnailId,
}

export const editFileContentValidator = new DtoFieldValidator(
  'edit-file-content', true, { isArray: false }, 'dto', editFileContentVmap
)

export const editImagesContentVmap: ValidatorMap<EditImagesContentAttrs> = {
  id: imagesVmap.id,
  sectionId: imagesVmap.sectionId,
  type: imagesVmap.type,
  title: imagesVmap.title,
  footer: imagesVmap.footer,
  order: imagesVmap.order,
  icon: imagesVmap.icon,
  description: imagesVmap.description,
  imageIds: imagesVmap.imageIds
}

export const editImagesContentValidator = new DtoFieldValidator(
  'edit-images-content', true, { isArray: false }, 'dto', editImagesContentVmap
)

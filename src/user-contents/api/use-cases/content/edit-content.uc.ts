import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { failure, success, type AbstractAggregateAttrs, type DTO, type PatchValue } from "rilata/core";
import type { EditingIsNotPermittedError } from "#app/domain/errors";
import type { EditUserContentCommand, EditUserContentMeta } from "#user-contents/domain/content/struct/edit-content/contract";
import type { FileContent } from "#user-contents/domain/content/struct/file-attrs";
import type { ThesisContent } from "#user-contents/domain/content/struct/thesis-attrs";
import type { DtoFieldValidator } from "rilata/validator";
import { UserContentAr } from "#user-contents/domain/content/a-root";
import { editFileContentValidator, editImagesContentValidator, editThesisContentValidator } from "#user-contents/domain/content/struct/edit-content/v-map";

export class EditUserContentUC extends UserContentUseCase<EditUserContentMeta> {
  arName = "UserContentAr" as const;

  name = "Edit User Content Use Case" as const;

  inputName = "edit-user-content" as const;

  protected supportAnonimousCall = false;

  // подставится в методе валидации
  declare validator: DtoFieldValidator<
    "edit-user-content", true, false, 
       PatchValue<Omit<ThesisContent, "createAt" | "updateAt">>
       | PatchValue<Omit<FileContent, "createAt" | "updateAt">>
  >;

  async runDomain(
    input: EditUserContentCommand, requestData: RequestScope,
  ): Promise<DomainResult<EditUserContentMeta>> {
    const { sectionId } = input.attrs;
    const getResult = await this.getContentSectionAttrs(sectionId);
    if (getResult.isFailure()) return failure(getResult.value);
    const sectionAttrs = getResult.value;

    const permissionCheckArAttrs: AbstractAggregateAttrs = {
      id: sectionId,
      ownerId: sectionAttrs.ownerId,
      ownerName: sectionAttrs.ownerName,
      context: sectionAttrs.context,
      access: sectionAttrs.access,
    }
    const canEdit = await this.canAction(permissionCheckArAttrs, requestData);
    if (!canEdit) {
      const notPermitError: EditingIsNotPermittedError = {
        name: "EditingIsNotPermittedError",
        description: 'Вам не разрешено редактировать контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }

    return this.editUserContent(input.attrs);
  }

  protected async editUserContent(
    attrs: EditUserContentCommand['attrs']
  ): Promise<DomainResult<EditUserContentMeta>> {
    const contentAttrs = await this.getUserContentRepo().findContent(attrs.id);
    if (!contentAttrs) {
      return failure({
        name: 'AggregateDoesNotExistError',
        description: 'Пользовательский контент с таким id не найден.',
        type: 'domain-error',
      });
    }

    const contentAr = new UserContentAr(contentAttrs);
    contentAr.editContent(attrs);
    const saveResult = await this.getUserContentRepo().updateContent(contentAr.getAttrs());
    if (saveResult.changes === 0) {
      throw this.logger.error(
        `[${this.constructor.name}]: db not save user content`,
        { patchAttrs: attrs, attrs: contentAr.getAttrs() }
      );
    }
    return success('success');
  }

  protected getValidator(input: EditUserContentCommand): DtoFieldValidator<string, true, boolean, DTO> {
    if (input.attrs.type === 'THESIS') return editThesisContentValidator;
    if (input.attrs.type === 'FILE') return editFileContentValidator;
    if (input.attrs.type === 'IMAGES') return editImagesContentValidator;
    throw this.logger.error(
      `[${this.constructor.name}]: not found validator for type: ${(input.attrs as any).type}.`,
      { inputAttrs: input.attrs }
    )
  }
}

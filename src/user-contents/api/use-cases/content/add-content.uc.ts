import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { AssertionException, failure, success, type AbstractAggregateAttrs, type DTO } from "rilata/core";
import type { AddingIsNotPermittedError } from "#app/domain/errors";
import { uuidUtility } from "rilata/api-helper";
import type {
  AddFileContentAttrs, AddThesisAttrs, AddUserContentCommand, AddUserContentMeta,
} from "#user-contents/domain/content/struct/add-content/contract";
import type { DtoFieldValidator } from "rilata/validator";
import { UserContentAr } from "#user-contents/domain/content/a-root";
import type { UserContent } from "#user-contents/domain/content/meta";
import { addFileContentValidator, addImagesContentValidator, addThesisContentValidator } from "#user-contents/domain/content/struct/add-content/v-map";

export class AddUserContentUC extends UserContentUseCase<AddUserContentMeta> {
  arName = "UserContentAr" as const;

  name = "Add Content Use Case" as const;

  inputName = "add-content" as const;

  // подставится в методе валидации
  declare validator: DtoFieldValidator<"add-content", true, false, AddThesisAttrs | AddFileContentAttrs>;

  protected supportAnonimousCall = false;

  async runDomain(
    input: AddUserContentCommand, requestData: RequestScope,
  ): Promise<DomainResult<AddUserContentMeta>> {
    const { sectionId } = input.attrs;
    const getResult = await this.getContentSectionAttrs(sectionId);
    if (getResult.isFailure()) return failure(getResult.value);
    const aRootAttrs = getResult.value;

    const permissionCheckArAttrs: AbstractAggregateAttrs = {
      id: sectionId,
      ownerId: aRootAttrs.ownerId,
      ownerName: aRootAttrs.ownerName,
      context: aRootAttrs.context,
      access: aRootAttrs.access,
    }
    const canAdd = await this.canAction(permissionCheckArAttrs, requestData);
    if (!canAdd) {
      const notPermitError: AddingIsNotPermittedError = {
        name: 'AddingIsNotPermittedError',
        description: 'Вам не разрешено добавлять контент.',
        type: "domain-error"
      }
      return failure(notPermitError);
    }
    return this.addUserContent(input.attrs);
  }

  protected async addUserContent(
    attrs: AddUserContentCommand['attrs']
  ): Promise<DomainResult<AddUserContentMeta>> {
    const newContent: UserContent = {
      id: uuidUtility.getNewUuidV7(),
      ...attrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    const contentAr = new UserContentAr(newContent);

    const repo = this.moduleResolver.userContentRepo;
    const result = await repo.addContent(contentAr.getAttrs());
    if (result.changes === 0) {
      throw this.serverResolver.logger.error(
        `[${this.constructor.name}]: fail to added thesis record at user content repo`,
        { newContent, attrs }
      )
    }
    return success({ contentId: newContent.id });
  }

  protected getValidator(input: AddUserContentCommand): DtoFieldValidator<string, true, boolean, DTO> {
    if (input.attrs.type === 'THESIS') return addThesisContentValidator;
    if (input.attrs.type === 'FILE') return addFileContentValidator;
    if (input.attrs.type === 'IMAGES') return addImagesContentValidator;
    throw this.logger.error(
      `[${this.constructor.name}]: not found validator for type: ${(input.attrs as any).type}.`,
      { inputAttrs: input.attrs }
    )
  }
}

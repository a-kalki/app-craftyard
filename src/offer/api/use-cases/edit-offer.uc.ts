import type {
  EditHobbyKitAttrs, EditOfferCommand, EditOfferMeta, EditWorkspaceRentAttrs,
} from "#offer/domain/crud/edit-offer/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import type { DtoFieldValidator } from "rilata/validator";
import { OfferUseCase } from "../base-uc";
import { callerUtils } from 'rilata/utils';
import { failure, success, type CheckedCaller, type DTO } from "rilata/core";
import type { OfferAttrs } from "#offer/domain/types";
import { editHobbyKitContentValidator, editWorkspaceRentValidator } from "#offer/domain/crud/edit-offer/v-map";

export class EditOfferUseCase extends OfferUseCase<EditOfferMeta> {
  arName = "BaseOfferAr" as const;

  name = "Edit Offer Use Case" as const;

  inputName = "edit-offer" as const;

  protected supportAnonimousCall = false;

  declare validator: DtoFieldValidator<"edit-offer", true, false, EditWorkspaceRentAttrs | EditHobbyKitAttrs>;

  async runDomain(input: EditOfferCommand, reqScope: RequestScope): Promise<DomainResult<EditOfferMeta>> {
    const checkedUser = callerUtils.userCaller(reqScope.caller);
    const getResult = await this.getOfferAr(input.attrs.id);
    if (getResult.isFailure()) return failure(getResult.value);
    const offerAr = getResult.value;

    if (await this.canEditOffer(offerAr.getAttrs(), checkedUser, input.requestId)) {
      return failure({
        name: 'EditingIsNotPermittedError',
        description: 'У вас нет прав на добавление предложения.',
        type: 'domain-error',
      });
    }
    
    offerAr.update(input.attrs);
    this.save(offerAr.getAttrs());
    return success('success');
  }

  protected async canEditOffer(
    attrs: OfferAttrs, caller: CheckedCaller, requestId: string
  ): Promise<boolean> {
    const { organizationId: workshopId, type } = attrs;
    const policy = this.getOfferPolicy(attrs, caller);
    if (type === 'WORKSPACE_RENT_OFFER') {
      const workshopResult = await this.moduleResolver.workshopFacade.getWorkshop(workshopId, caller, requestId);
      if (workshopResult.isFailure()) {
        return policy.canEdit();
      }
      return policy.canEditWorkspaceRent(workshopResult.value);
    };
    if (type === 'HOBBY_KIT_OFFER') return policy.canEditHobbiKit();
    if (type === 'PRODUCT_SALE_OFFER') return policy.canEditProductSale();
    if (type === 'COURSE_OFFER') return policy.canEditCourse();
    throw this.logger.error(
      `[${this.constructor.name}]: Получен неизвестный тип оффера: ${type}.`,
    )
  }

  protected getValidator(input: EditOfferCommand): DtoFieldValidator<string, true, boolean, DTO> {
    const { type } = input.attrs;
    if (type === 'HOBBY_KIT_OFFER') return editHobbyKitContentValidator;
    else if (type === 'WORKSPACE_RENT_OFFER') return editWorkspaceRentValidator;
    throw this.logger.error(`[${this.constructor.name}]: Не удалось найти валидатор для типа: ${type}`);
  }
}

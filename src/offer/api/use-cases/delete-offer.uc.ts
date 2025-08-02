import type { DeleteOfferCommand, DeleteOfferMeta } from "#offer/domain/crud/delete-offer/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import { OfferUseCase } from "../base-uc";
import { callerUtils } from 'rilata/utils';
import { failure, success, type CheckedCaller } from "rilata/core";
import type { OfferAttrs } from "#offer/domain/types";
import { deleteOfferValidator } from "#offer/domain/crud/delete-offer/v-map";
import { OfferPolicy } from "#offer/domain/policy";

export class DeleteOfferUseCase extends OfferUseCase<DeleteOfferMeta> {
  arName = "BaseOfferAr" as const;

  name = "Delete Offer Use Case" as const;

  inputName = "delete-offer" as const;

  protected supportAnonimousCall = false;

  protected validator = deleteOfferValidator;

  async runDomain(input: DeleteOfferCommand, reqScope: RequestScope): Promise<DomainResult<DeleteOfferMeta>> {
    const checkedUser = callerUtils.userCaller(reqScope.caller);
    const getResult = await this.getOfferAttrs(input.attrs.offerId);
    if (getResult.isFailure()) {
      return failure(getResult.value);
    }
    const offerAttrs = getResult.value;
    if (!(await this.canDeleteOffer(offerAttrs, checkedUser, input.requestId))) {
      return failure({
        name: 'DeletingIsNotPermittedError',
        description: 'У вас нет прав на удаление оффера.',
        type: 'domain-error',
      });
    }
    
    await this.getRepo().deleteOffer(offerAttrs.id);
    return success('success');
  }

  protected async canDeleteOffer(
    offerAttrs: OfferAttrs, caller: CheckedCaller, reqId: string,
  ): Promise<boolean> {

    const policy = new OfferPolicy(caller, offerAttrs);
    if (offerAttrs.type === 'WORKSPACE_RENT_OFFER') {
      const result = await this.moduleResolver.workshopFacade.getWorkshop(
        offerAttrs.organizationId, caller, reqId
      );
      if (result.isFailure()) return false;
      const workshopAttrs = result.value;
      return policy.canEditWorkspaceRent(workshopAttrs);
    };
    if (offerAttrs.type === 'HOBBY_KIT_OFFER') return policy.canEditHobbiKit();
    if (offerAttrs.type === 'PRODUCT_SALE_OFFER') return policy.canEditProductSale();
    if (offerAttrs.type === 'COURSE_OFFER') return policy.canEditCourse();
    throw this.logger.error(
      `[${this.constructor.name}]: Получен неизвестный тип оффера: ${(offerAttrs as any).type}.`,
    )
  }
}

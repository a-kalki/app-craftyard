import type {
  AddHobbyKitAttrs, AddOfferCommand, AddOfferMeta, AddWorkspaceRentAttrs,
} from "#offer/domain/crud/add-offer/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import type { DtoFieldValidator } from "rilata/validator";
import { OfferUseCase } from "../base-uc";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";
import { callerUtils } from 'rilata/utils';
import { failure, success, type CheckedCaller, type DTO } from "rilata/core";
import { uuidUtility } from "rilata/api-helper";
import { WorkspaceRentOfferAR } from "#offer/domain/workspace-rent/a-root";
import { WorkshopPolicy } from "#workshop/domain/policy";
import type { OfferAttrs } from "#offer/domain/types";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import { HobbyKitOfferAR } from "#offer/domain/hobby-kit/a-root";
import { addHobbyKitContentValidator, addWorkspaceRentValidator } from "#offer/domain/crud/add-offer/v-map";

export class AddOfferUseCase extends OfferUseCase<AddOfferMeta> {
  arName = "BaseOfferAr" as const;

  name = "Add Offer Use Case" as const;

  inputName = "add-offer" as const;

  protected supportAnonimousCall = false;

  declare validator: DtoFieldValidator<"add-offer", true, false, AddWorkspaceRentAttrs | AddHobbyKitAttrs>;

  async runDomain(input: AddOfferCommand, reqScope: RequestScope): Promise<DomainResult<AddOfferMeta>> {
    const checkedUser = callerUtils.userCaller(reqScope.caller);
    if (await this.canAddOffer(input.attrs, checkedUser)) {
      return failure({
        name: 'AddingIsNotPermittedError',
        description: 'У вас нет прав на добавление предложения.',
        type: 'domain-error',
      });
    }
    
    let attrs: OfferAttrs;
    if (input.attrs.type === 'WORKSPACE_RENT_OFFER')
      attrs = this.getWorkspaceRentAttrs(input.attrs, checkedUser.id);
    else if (input.attrs.type === 'HOBBY_KIT_OFFER')
      attrs = this.getHobbyKitAttrs(input.attrs, checkedUser.id);
    else throw this.logger.error(
      `Не найден обработчик для получения attrs типа: ${(input.attrs as any).type}`
    );
    await this.getRepo().addOffer(attrs);
    return success({ id: attrs.id });
  }

  protected async canAddOffer(attrs: AddOfferCommand['attrs'], caller: CheckedCaller): Promise<boolean> {
    const { organizationId: workshopId, type } = attrs;
    const workshopResult = await this.moduleResolver.workshopFacade.getWorkshop(workshopId, caller);
    if (workshopResult.isFailure()) {
      return false;
    }
    const policy = new WorkshopPolicy(caller, workshopResult.value);
    if (type === 'WORKSPACE_RENT_OFFER') return policy.canAddWorkshopRentOffer();
    if (type === 'HOBBY_KIT_OFFER') return policy.canAddHobbyKitOffer();
    if (type === 'PRODUCT_SALE_OFFER') return policy.canAddProductSaleOffer();
    if (type === 'COURSE_OFFER') return policy.canAddCourseOffer();
    throw this.logger.error(
      `[${this.constructor.name}]: Получен неизвестный тип оффера: ${type}.`,
    )
  }

  protected getWorkspaceRentAttrs(
    addAttrs: AddWorkspaceRentAttrs, callerId: string
  ): WorkspaceRentOfferAttrs {
    const attrs: WorkspaceRentOfferAttrs = {
      id: uuidUtility.getNewUuidV7(),
      status: 'pending_moderation',
      editorIds: [callerId],
      ...addAttrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }

    const ar = new WorkspaceRentOfferAR(attrs); // checkInvariants
    return ar.getAttrs();
  }

  protected getHobbyKitAttrs(
    addAttrs: AddHobbyKitAttrs, callerId: string
  ): HobbyKitOfferAttrs {
    const attrs: HobbyKitOfferAttrs = {
      id: uuidUtility.getNewUuidV7(),
      status: 'pending_moderation',
      estimatedExpenses: [],
      editorIds: [callerId],
      ...addAttrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    const ar = new HobbyKitOfferAR(attrs); // checkInvariants
    return ar.getAttrs();
  }

  protected getValidator(input: AddOfferCommand): DtoFieldValidator<string, true, boolean, DTO> {
    const { type } = input.attrs;
    if (type === 'HOBBY_KIT_OFFER') return addHobbyKitContentValidator;
    else if (type === 'WORKSPACE_RENT_OFFER') return addWorkspaceRentValidator;
    throw this.logger.error(`[${this.constructor.name}]: Не удалось найти валидатор для типа: ${type}`);
  }
}

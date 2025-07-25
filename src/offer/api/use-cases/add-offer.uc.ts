import type {
    AddCourseOfferAttrs,
  AddHobbyKitOfferAttrs, AddOfferCommand, AddOfferMeta, AddProductSaleOfferAttrs, AddWorkspaceRentOfferAttrs,
} from "#offer/domain/crud/add-offer/contract";
import type { RequestScope, DomainResult } from "rilata/api";
import type { DtoFieldValidator } from "rilata/validator";
import { OfferUseCase } from "../base-uc";
import type { WorkspaceRentOfferAttrs } from "#offer/domain/workspace-rent/struct/attrs";
import { callerUtils } from 'rilata/utils';
import { failure, success, type Caller, type CheckedCaller, type DTO, type Result } from "rilata/core";
import { uuidUtility } from "rilata/api-helper";
import { WorkspaceRentOfferAR } from "#offer/domain/workspace-rent/a-root";
import { WorkshopPolicy } from "#workshop/domain/policy";
import type { OfferAttrs } from "#offer/domain/types";
import type { HobbyKitOfferAttrs } from "#offer/domain/hobby-kit/struct/attrs";
import { HobbyKitOfferAR } from "#offer/domain/hobby-kit/a-root";
import {
    addCourseOfferValidator,
  addHobbyKitOfferValidator, addProductSaleOfferValidator, addWorkspaceRentOfferValidator,
}from "#offer/domain/crud/add-offer/v-map";
import { hobbyKitOfferService } from "#offer/domain/hobby-kit/services/hobby-kit-service";
import type { AggregateDoesNotExistError, DomainRuleError } from "#app/core/errors";
import type { ProductSaleOfferAttrs } from "#offer/domain/product-sale/struct/attrs";
import { ProductSaleOfferAR } from "#offer/domain/product-sale/a-root";
import type { CourseOfferAttrs } from "#offer/domain/course/struct/attrs";
import { CourseOfferAR } from "#offer/domain/course/a-root";

export class AddOfferUseCase extends OfferUseCase<AddOfferMeta> {
  arName = "BaseOfferAr" as const;

  name = "Add Offer Use Case" as const;

  inputName = "add-offer" as const;

  protected supportAnonimousCall = false;

  declare validator: DtoFieldValidator<"add-offer", true, false, AddWorkspaceRentOfferAttrs | AddHobbyKitOfferAttrs>;

  async runDomain(input: AddOfferCommand, reqScope: RequestScope): Promise<DomainResult<AddOfferMeta>> {
    const checkedUser = callerUtils.userCaller(reqScope.caller);
    if (!(await this.canAddOffer(input, checkedUser))) {
      return failure({
        name: 'AddingIsNotPermittedError',
        description: 'У вас нет прав на добавление предложения.',
        type: 'domain-error',
      });
    }

    const checkResult = await this.checkDomainRules(input, checkedUser);
    if (checkResult.isFailure()) return failure(checkResult.value);
    
    let attrs: OfferAttrs;
    if (input.attrs.type === 'WORKSPACE_RENT_OFFER')
      attrs = this.getWorkspaceRentAttrs(input.attrs, checkedUser.id);
    else if (input.attrs.type === 'HOBBY_KIT_OFFER')
      attrs = this.getHobbyKitAttrs(input.attrs, checkedUser.id);
    else if (input.attrs.type === 'PRODUCT_SALE_OFFER')
      attrs = this.getProductSaleAttrs(input.attrs, checkedUser.id);
    else if (input.attrs.type === 'COURSE_OFFER')
      attrs = this.getCourseAttrs(input.attrs, checkedUser.id);
    else throw this.logger.error(
      `Не найден обработчик для получения attrs типа: ${(input.attrs as any).type}`
    );
    await this.getRepo().addOffer(attrs);
    return success({ id: attrs.id });
  }

  protected async canAddOffer(cmd: AddOfferCommand, caller: CheckedCaller): Promise<boolean> {
    const workshopResult = await this.getWorkshopAttrs(cmd.attrs.organizationId, caller, cmd.requestId);
    if (workshopResult.isFailure()) return false;

    const type = cmd.attrs.type;
    const policy = new WorkshopPolicy(caller, workshopResult.value);
    if (type === 'WORKSPACE_RENT_OFFER') return policy.canAddWorkshopRentOffer();
    if (type === 'HOBBY_KIT_OFFER') return policy.canAddHobbyKitOffer();
    if (type === 'PRODUCT_SALE_OFFER') return policy.canAddProductSaleOffer();
    if (type === 'COURSE_OFFER') return policy.canAddCourseOffer();
    throw this.logger.error(
      `[${this.constructor.name}]: Получен неизвестный тип оффера: ${type}.`,
    )
  }

  protected async checkDomainRules(
    cmd: AddOfferCommand, caller: CheckedCaller,
  ): Promise<Result<DomainRuleError | AggregateDoesNotExistError, undefined>> {
    if (cmd.attrs.type === 'WORKSPACE_RENT_OFFER') {
      return success(undefined);
    };

    if (cmd.attrs.type === 'HOBBY_KIT_OFFER')
      return this.checkHobbyKitDomainRules(cmd, caller);

    if (cmd.attrs.type === 'PRODUCT_SALE_OFFER')
      return success(undefined);

    if (cmd.attrs.type === 'COURSE_OFFER')
      return success(undefined);

    throw this.logger.error(
      `[${this.constructor.name}]: неизвестный тип`,
      { command: cmd}
    )
  }

  protected async checkHobbyKitDomainRules(
    cmd: AddOfferCommand, caller: Caller
  ): Promise<Result<DomainRuleError | AggregateDoesNotExistError, undefined>> {
    if (cmd.attrs.type !== 'HOBBY_KIT_OFFER') throw Error('Просто очистка типа');

    const modelResult = await this.getModelAttrs(cmd.attrs.modelId, caller, cmd.requestId);
    if (modelResult.isFailure()) return failure(modelResult.value);

    const rentOfferResult = await this.getOfferAttrs(cmd.attrs.workspaceRentOfferId);
    if (rentOfferResult.isFailure() || rentOfferResult.value.type !== 'WORKSPACE_RENT_OFFER') {
      this.logger.error(
        `[${this.constructor.name}]: Не удалось загрузить оффер абонемента или получен не тот тип.`,
        { result: rentOfferResult.toObject() }
      );
      return failure({
        name: 'AggregateDoesNotExistError',
        description: 'Не удалось загрузить оффер абонемента или получен не тот тип.',
        type: 'domain-error',
      });
    };

    const checkErrors = hobbyKitOfferService.checkNetProfit(
      cmd.attrs.cost,
      modelResult.value,
      rentOfferResult.value,
    );
    if (checkErrors.length !== 0) return failure({
      name: 'DomainRuleError',
      description: checkErrors.join(', '),
      type: 'domain-error',
    });
    return success(undefined);
  }

  protected getWorkspaceRentAttrs(
    addAttrs: AddWorkspaceRentOfferAttrs, callerId: string
  ): WorkspaceRentOfferAttrs {
    const attrs: WorkspaceRentOfferAttrs = {
      id: uuidUtility.getNewUuidV7(),
      status: 'active', // нет других мастеров, нет причин отправлять на модерацию
      editorIds: [callerId],
      ...addAttrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }

    const ar = new WorkspaceRentOfferAR(attrs); // checkInvariants
    return ar.getAttrs();
  }

  protected getHobbyKitAttrs(
    addAttrs: AddHobbyKitOfferAttrs, callerId: string
  ): HobbyKitOfferAttrs {
    const attrs: HobbyKitOfferAttrs = {
      id: uuidUtility.getNewUuidV7(),
      status: 'active',
      estimatedExpenses: [],
      editorIds: [callerId],
      ...addAttrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    const ar = new HobbyKitOfferAR(attrs); // checkInvariants
    return ar.getAttrs();
  }

  protected getProductSaleAttrs(
    addAttrs: AddProductSaleOfferAttrs, callerId: string
  ): ProductSaleOfferAttrs {
    const attrs: ProductSaleOfferAttrs = {
      id: uuidUtility.getNewUuidV7(),
      status: 'active',
      estimatedExpenses: [],
      editorIds: [callerId],
      ...addAttrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    const ar = new ProductSaleOfferAR(attrs); // checkInvariants
    return ar.getAttrs();
  }

  protected getCourseAttrs(
    addAttrs: AddCourseOfferAttrs, callerId: string
  ): CourseOfferAttrs {
    const attrs: CourseOfferAttrs = {
      id: uuidUtility.getNewUuidV7(),
      status: 'active',
      estimatedExpenses: [],
      editorIds: [callerId],
      ...addAttrs,
      createAt: Date.now(),
      updateAt: Date.now(),
    }
    const ar = new CourseOfferAR(attrs); // checkInvariants
    return ar.getAttrs();
  }

  protected getValidator(input: AddOfferCommand): DtoFieldValidator<string, true, boolean, DTO> {
    const { type } = input.attrs;
    if (type === 'HOBBY_KIT_OFFER') return addHobbyKitOfferValidator;
    else if (type === 'WORKSPACE_RENT_OFFER') return addWorkspaceRentOfferValidator;
    else if (type === 'PRODUCT_SALE_OFFER') return addProductSaleOfferValidator;
    else if (type === 'COURSE_OFFER') return addCourseOfferValidator;
    throw this.logger.error(`[${this.constructor.name}]: Не удалось найти валидатор для типа: ${type}`);
  }
}

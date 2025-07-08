import { AggregateRoot } from "rilata/domain";
import type { CooperationNodeArMeta } from "./meta";
import type { CooperationNodeAttrs } from "./struct/attrs";
import type { CheckStructureData } from "../childable/struct/types";
import type { CooperationValidationError } from "./struct/types";
import type { Childable, CommandCooperation, Executable, Executor, Fatherble, OfferCooperation, OrganizationCooperation } from "./struct/interfaces";

export abstract class CooperationNodeAr<META extends CooperationNodeArMeta> extends  AggregateRoot<META> {
  getShortName(): string {
    return this.attrs.title;
  }

  getResponsibilies(): CooperationNodeAttrs['responsibilities'] {
    return [ ...this.attrs.responsibilities ];
  }

  getType(): META['attrs']['type'] {
    return this.attrs.type;
  }

  abstract isChildable(): this is Childable

  abstract isFatherable(): this is Fatherble

  abstract isExecutable(): this is Executable

  abstract isOrganization(): this is OrganizationCooperation

  abstract isOffer(): this is OfferCooperation

  abstract isCommand(): this is CommandCooperation

  abstract isExecutor(): this is Executor

  abstract checkStructure(structData: CheckStructureData): CooperationValidationError[]

  protected getValidationResult(
    errName: string, description: string, type?: CooperationValidationError['type']
  ): CooperationValidationError {
    return {
      nodeId: this.attrs.id,
      nodeTitle: this.attrs.title,
      errName,
      description,
      type: type ?? "error"
    }
  }
}

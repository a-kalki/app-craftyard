import { AggregateRoot } from "rilata/domain";
import type { NodeArMeta } from "./meta";
import type { CooperationNodeAttrs } from "./struct/attrs";
import type { CooperationValidationError } from "../interfaces/types";
import type {
  Childable, CommandCooperation, Executable, Executor, Fatherble,
  OfferCooperation, OrganizationCooperation,
} from "../interfaces/api";
import type { Cost } from "#app/domain/types";
import type { Node, StructureContext } from "../interfaces/node";

export abstract class NodeAr<META extends NodeArMeta>
  extends  AggregateRoot<META>
  implements Node
{
  getShortName(): string {
    return this.getTitle();
  }

  getTitle(): string {
    return this.attrs.title;
  }

  getResponsibilies(): CooperationNodeAttrs['responsibilities'] {
    return [ ...this.attrs.responsibilities ];
  }

  getType(): META['attrs']['type'] {
    return this.attrs.type;
  }

  abstract info(): string;

  abstract distributeProfit(amount: Cost, context: StructureContext): void

  abstract isChildable(): this is Childable

  abstract isFatherable(): this is Fatherble

  abstract isExecutable(): this is Executable

  abstract isOrganization(): this is OrganizationCooperation

  abstract isOffer(): this is OfferCooperation

  abstract isCommand(): this is CommandCooperation

  abstract isExecutor(): this is Executor

  abstract checkStructure(context: StructureContext): CooperationValidationError[]

  isValid(context: StructureContext): boolean {
    return this.checkStructure(context).length === 0;
  }

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

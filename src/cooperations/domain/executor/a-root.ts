import type { ExecutorArMeta } from "./meta";
import { NodeAr } from "../base/node/a-root";
import type { ExecutorAttrs } from "./struct/attrs";
import { executorValidator } from "./struct/v-map";
import type { CooperationValidationError } from "../base/interfaces/types";
import type {
  Childable, CommandCooperation, Executable, Executor, Fatherble,
  OfferCooperation, OrganizationCooperation,
} from "../base/interfaces/api";
import type { Cost } from "#app/core/types";
import type { StructureContext } from "../base/interfaces/node";

export class ExecutorAr
  extends NodeAr<ExecutorArMeta>
  implements Executor
{
  name = "ExecutorAr" as const;

  constructor(attrs: ExecutorAttrs) {
    super(attrs, executorValidator);
  }

  info(): string {
    return `${this.getType()}: comission: ${Math.round(this.attrs.profitPercentage * 100)}%`
  }

  distributeProfit(amount: Cost, context: StructureContext): void {
    context.recordDistributionResult(this.getId(), amount);
  }

  isChildable(): this is Childable {
    return false;
  }

  isFatherable(): this is Fatherble {
    return false;
  }

  isOrganization(): this is OrganizationCooperation {
    return false;
  }

  isOffer(): this is OfferCooperation {
    return false;
  }

  isCommand(): this is CommandCooperation {
    return false;
  }

  isExecutable(): this is Executable {
    return true;
  }

  isExecutor(): this is Executor {
    return true;
  }

  getOwnerId(): string {
    return this.attrs.ownerId;
  }

  getProfitProcentage(): number {
    return this.attrs.profitPercentage;
  }

  public checkStructure(context: StructureContext): CooperationValidationError[] {
    return [];
  }
}

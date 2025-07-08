import type { ExecutorArMeta } from "./meta";
import { CooperationNodeAr } from "../base/node/a-root";
import type { ExecutorAttrs } from "./struct/attrs";
import { executorValidator } from "./struct/v-map";
import type { CheckStructureData } from "../base/childable/struct/types";
import type { CooperationValidationError } from "../base/node/struct/types";
import type { Childable, CommandCooperation, Executable, Executor, Fatherble, OfferCooperation, OrganizationCooperation } from "../base/node/struct/interfaces";

export class ExecutorAr
  extends CooperationNodeAr<ExecutorArMeta>
  implements Executor
{
  name = "ExecutorAr" as const;

  constructor(attrs: ExecutorAttrs) {
    super(attrs, executorValidator);
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

  getProfit(): number {
    return this.attrs.profitPercentage;
  }

  public checkStructure(structData: CheckStructureData): CooperationValidationError[] {
    const errors: CooperationValidationError[] = [];

    if (structData.childrenDistributionShares) {
      errors.push(this.getValidationResult(
        'FoundedChildrens',
        `[${this.getShortName} (${this.getId()})]: найдено ненужное свойство childrenDistributionShares.`,
        'system-error',
      ));
    }
    if (structData.fatherDistributionShare) {
      errors.push(this.getValidationResult(
        'FoundedFather',
        `[${this.getShortName} (${this.getId()})]: найдено ненужное свойство fatherDistributionShare.`,
        'system-error',
      ));
    }
    return errors;
  }
}

import { ChildableAr } from "#cooperation/domain/base/childable/a-root";
import type { OrganizationCooperationArMeta } from "./meta";
import type { OrganizationCooperationAttrs } from "./struct/attrs";
import { organizationCooperationValidator } from "./struct/v-map";
import type { Fatherble, OrganizationCooperation, OfferCooperation, Executable, Executor, CommandCooperation } from "#cooperation/domain/base/interfaces/api";
import type { Cost } from "#app/domain/types";
import type { StructureContext } from "#cooperation/domain/base/interfaces/node";
import { AssertionException } from "rilata/core";
import { costUtils } from "#app/domain/utils/cost/cost-utils";

export class OrganizationCooperationAr
  extends ChildableAr<OrganizationCooperationArMeta>
  implements OrganizationCooperation
{
  name = "OrganizationCoperationAr" as const;

  constructor(attrs: OrganizationCooperationAttrs) {
    super(attrs, organizationCooperationValidator);
  }

  distributeProfit(amount: Cost, context: StructureContext): void {
    context.recordDistributionResult(this.getId(), amount);

    let childsAmount = amount;
    const fatherId = this.getFatherId();
    if (fatherId) {
      const fatherNode = context.getFather(fatherId);
      if (!fatherNode || !fatherNode.isOrganization()) {
        throw new AssertionException(
          `[${this.constructor.name}]: not founded father node or not organization: ${this.getShortName()} (${this.getId()})`,
        );
      }

      const fatherAmount = costUtils.percent(amount, fatherNode.commissionPercentage());
      fatherNode.distributeProfit(fatherAmount, context);

      childsAmount = costUtils.diff(amount, fatherAmount);
    }

    this.distributeProfitToChilds(childsAmount, context);
  }

  isFatherable(): this is Fatherble {
    return true;
  }

  isOrganization(): this is OrganizationCooperation {
    return true;
  }

  isOffer(): this is OfferCooperation {
    return false;
  }

  isCommand(): this is CommandCooperation {
    return false;
  }

  isExecutable(): this is Executable {
    return false;
  }

  isExecutor(): this is Executor {
    return false;
  }

  commissionPercentage(): number {
    return this.attrs.commissionPercentage;
  }

  getFatherId(): string | undefined {
    return this.attrs.fatherId;
  }
}

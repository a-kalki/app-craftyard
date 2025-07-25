import { ChildableAr } from "#cooperations/domain/base/childable/a-root";
import type { OfferCooperationArMeta } from "./meta";
import type { OfferCooperationAttrs } from "./struct/attrs";
import { offerCooperationContributionValidator } from "./struct/v-map";
import type {
  CommandCooperation, Executable, Executor, Fatherble, OfferCooperation, OrganizationCooperation,
}from "#cooperations/domain/base/interfaces/api";
import type { Cost } from "#app/core/types";
import type { StructureContext } from "#cooperations/domain/base/interfaces/node";
import { AssertionException } from "rilata/core";
import { costUtils } from "#app/core/utils/cost/cost-utils";

export class OfferCooperationAr
  extends ChildableAr<OfferCooperationArMeta>
  implements OfferCooperation
{
  name = "OfferCooperationAr" as const;

  constructor(attrs: OfferCooperationAttrs) {
    super(attrs, offerCooperationContributionValidator);
  }

  info(): string {
    return `${this.getType()}`;
  }

  distributeProfit(amount: Cost, context: StructureContext): void {
    context.recordDistributionResult(this.getId(), amount);

    const fatherNode = context.getFather(this.getFatherId());
    if (!fatherNode || !fatherNode.isOrganization()) {
      throw new AssertionException(
        `[${this.constructor.name}]: not founded father node or not organization: ${this.getShortName()} (${this.getId()})`,
      );
    }

    const fatherAmount = costUtils.percent(amount, fatherNode.commissionPercentage());
    fatherNode.distributeProfit(fatherAmount, context);

    const childsAmount = costUtils.diff(amount, fatherAmount);
    this.distributeProfitToChilds(childsAmount, context);
  }

  isFatherable(): this is Fatherble {
    return true;
  }

  isOrganization(): this is OrganizationCooperation {
    return false;
  }

  isOffer(): this is OfferCooperation {
    return true;
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

  getFatherId(): string {
    return this.attrs.fatherId;
  }
}

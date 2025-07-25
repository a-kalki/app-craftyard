import { ChildableAr } from "#cooperations/domain/base/childable/a-root";
import type { OrganizationCooperationArMeta } from "./meta";
import type { OrganizationCooperationAttrs } from "./struct/attrs";
import { organizationCooperationValidator } from "./struct/v-map";
import type { Fatherble, OrganizationCooperation, OfferCooperation, Executable, Executor, CommandCooperation } from "#cooperations/domain/base/interfaces/api";
import type { Cost } from "#app/core/types";
import type { StructureContext } from "#cooperations/domain/base/interfaces/node";
import { AssertionException } from "rilata/core";
import { costUtils } from "#app/core/utils/cost/cost-utils";

export class OrganizationCooperationAr
  extends ChildableAr<OrganizationCooperationArMeta>
  implements OrganizationCooperation
{
  name = "OrganizationCoperationAr" as const;

  constructor(attrs: OrganizationCooperationAttrs) {
    super(attrs, organizationCooperationValidator);
  }

  info(): string {
    return `${this.getType()}: comission: ${Math.round(this.attrs.commissionPercentage * 100)}%`
  }

  distributeProfit(amount: Cost, context: StructureContext): void {
    context.recordDistributionResult(this.getId(), amount);

    try {
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
    } catch (err) {
      // Если распределение пришло с offer, то детей данного узла в контексте не будет.
      // Распределение потока от offer, должно выполняться с другого дерева CooperationStructure.
      if ((err as Error).message.startsWith('[StructureContextObject]: not founded node by id:')) return;
      throw err;
    }
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

import { ChildableAr } from "#cooperation/domain/base/childable/a-root";
import type { OrganizationCooperationArMeta } from "./meta";
import type { OrganizationCooperationAttrs } from "./struct/attrs";
import { organizationCooperationValidator } from "./struct/v-map";
import type { Fatherble, OrganizationCooperation, OfferCooperation, Executable, Executor, CommandCooperation } from "#cooperation/domain/base/node/struct/interfaces";

export class OrganizationCooperationAr
  extends ChildableAr<OrganizationCooperationArMeta>
  implements OrganizationCooperation
{
  name = "OrganizationCoperationAr" as const;

  constructor(attrs: OrganizationCooperationAttrs) {
    super(attrs, organizationCooperationValidator);
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

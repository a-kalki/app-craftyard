import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { getOwnerArThesisSetsValidator } from "./v-map";
import { success } from "rilata/core";
import type { GetOwnerArThesisSetsCommand, GetOwnerArThesisSetsMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/get-owner-ar-sets";
import type { ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";

export class GetOwnerArThesisSetsUC extends UserContentUseCase<GetOwnerArThesisSetsMeta> {
  arName = "ThesisSetAr" as const;

  name = "Get Owner Ar Thesis Sets Use Case" as const;

  inputName = "get-owner-ar-thesis-sets" as const;

  protected supportAnonimousCall = true;

  protected validator = getOwnerArThesisSetsValidator;

  async runDomain(
    input: GetOwnerArThesisSetsCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetOwnerArThesisSetsMeta>> {
    const { ownerId } = input.attrs;

    const repo = this.moduleResolver.thesisSetRepo;
    const thesisSets = await repo.getOwnerArThesisSets(ownerId);
    return success(await this.filterByPermit(thesisSets, reqScope));
  }

  protected async filterByPermit(
    thesisSets: ThesisSetAttrs[], reqScope: RequestScope
  ): Promise<ThesisSetAttrs[]> {
    const canGets = await Promise.all(thesisSets.map(ts => this.canAction(ts, reqScope)));
    return thesisSets.filter((_ts, i) => canGets[i]);
  }
}

import { UserContentUseCase } from "#user-contents/api/base-uc";
import type { RequestScope, DomainResult } from "rilata/api";
import { success } from "rilata/core";
import type { ContentSectionAttrs } from "#user-contents/domain/section/struct/attrs";
import type { GetOwnerArContentSectionsCommand, GetOwnerArContentSectionsMeta } from "#user-contents/domain/section/struct/get-owner-sections/contract";
import { getOwnerArContentSectionsValidator } from "#user-contents/domain/section/struct/get-owner-sections/v-map";

export class GetOwnerArContentSectionsUC extends UserContentUseCase<GetOwnerArContentSectionsMeta> {
  arName = "ContentSectionAr" as const;

  name = "Get Owner Ar Content Sections Use Case" as const;

  inputName = "get-owner-ar-content-sections" as const;

  protected supportAnonimousCall = true;

  protected validator = getOwnerArContentSectionsValidator;

  async runDomain(
    input: GetOwnerArContentSectionsCommand, reqScope: RequestScope,
  ): Promise<DomainResult<GetOwnerArContentSectionsMeta>> {
    const { ownerId } = input.attrs;

    const repo = this.moduleResolver.contentSectionRepo;
    const thesisSets = await repo.getOwnerArContentSections(ownerId);
    return success(await this.filterByPermit(thesisSets, reqScope));
  }

  protected async filterByPermit(
    thesisSets: ContentSectionAttrs[], reqScope: RequestScope
  ): Promise<ContentSectionAttrs[]> {
    const canGets = await Promise.all(thesisSets.map(ts => this.canAction(ts, reqScope)));
    return thesisSets.filter((_ts, i) => canGets[i]);
  }
}

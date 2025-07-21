import type { UserContentModule } from "#user-contents/api/module";
import type { ApiUserContentsSectionFacade } from "#user-contents/domain/section/facade";
import type { AddContentSectionCommand, AddContentSectionMeta } from "#user-contents/domain/section/struct/add-section/contract";
import type { Caller, BackendResultByMeta } from "rilata/core";

export class ApiUserContendSectionMonolithFacade implements ApiUserContentsSectionFacade {
  constructor(protected module: UserContentModule) {}

  async addContentSection(
    attrs: AddContentSectionCommand["attrs"], caller: Caller, requestId: string,
  ): Promise<BackendResultByMeta<AddContentSectionMeta>> {
    const command: AddContentSectionCommand = {
      name: "add-content-section",
      attrs,
      requestId
    };
    return this.module.handleRequest(
      command, { caller },
    ) as unknown as BackendResultByMeta<AddContentSectionMeta>
  }
}

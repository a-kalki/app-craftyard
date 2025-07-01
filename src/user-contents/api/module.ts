import type { UserContentModuleMeta, UserContentModuleResolver, UserContentModuleResolvers } from "./types";
import { userContentModuleConfig, userContentModulePermissionCheckers, userContentModuleUseCases } from "./setup";
import { CraftYardModule } from "#app/api/module";
import { ContentSectionAr } from "#user-contents/domain/section/a-root";
import { UserContentAr } from "#user-contents/domain/content/a-root";

export class UserContentModule extends CraftYardModule<UserContentModuleMeta> {
    name = "User Content Module" as const;

    getModuleResolver(): UserContentModuleResolver {
      return this.resolvers.moduleResolver;
    }

    constructor(resolvers: UserContentModuleResolvers) {
      super(
        userContentModuleConfig,
        resolvers,
        userContentModuleUseCases,
        userContentModulePermissionCheckers
      )
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const sections = await this.resolvers.moduleResolver.contentSectionRepo.getContentSections();
      sections.forEach(section => new ContentSectionAr(section));

      const contents = await this.resolvers.moduleResolver.userContentRepo.filterContent({});
      contents.forEach((content => new UserContentAr(content)));
    }
}

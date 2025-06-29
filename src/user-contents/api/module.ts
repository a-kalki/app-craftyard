import type { UserContentModuleMeta, UserContentModuleResolver, UserContentModuleResolvers } from "./types";
import { userContentModuleConfig, userContentModulePermissionCheckers, userContentModuleUseCases } from "./setup";
import { CraftYardModule } from "#app/api/module";
import { ThesisSetAr } from "#user-contents/domain/thesis-set/a-root";

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
      const thesisSets = await this.resolvers.moduleResolver.thesisSetRepo.getThesisSets();
      thesisSets.forEach(attrs => new ThesisSetAr(attrs));
    }
}

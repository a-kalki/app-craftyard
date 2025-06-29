import type { FilesModuleMeta, FilesModuleResolver, FilesModuleResolvers } from "./types";
import { filesModuleConfig, filesModulePermissionCheckers, filesModuleUseCases } from "./setup";
import { FileModuleController } from "./controller";
import { FileAr } from "#app/domain/file/a-root";
import { CraftYardModule } from "#app/api/module";

export class FilesModule extends CraftYardModule<FilesModuleMeta> {
    name = "Files Module" as const;

    getModuleResolver(): FilesModuleResolver {
      return this.resolvers.moduleResolver;
    }

    constructor(resolvers: FilesModuleResolvers) {
      super(
        filesModuleConfig,
        resolvers,
        filesModuleUseCases,
        filesModulePermissionCheckers,
      )
      this.checkArInvariants();
    }

    async checkArInvariants(): Promise<void> {
      const files = await this.resolvers.moduleResolver.fileRepo.getFiles();
      files.forEach(attrs => new FileAr(attrs));
    }

    protected makeController(): void {
      this.controller = new FileModuleController(this);
    }
}

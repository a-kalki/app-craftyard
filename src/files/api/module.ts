import { WebModule } from "rilata/api";
import { FileAr } from "../domain/a-root";
import type { FilesModuleMeta, FilesModuleResolver, FilesModuleResolvers } from "./types";
import { filesModuleConfig, filesModuleUseCases } from "./setup";
import { FileModuleController } from "./controller";

export class FilesModule extends WebModule<FilesModuleMeta> {
    name = "Files Module" as const;

    getModuleResolver(): FilesModuleResolver {
      return this.resolvers.moduleResolver;
    }

    constructor(resolvers: FilesModuleResolvers) {
      super(
        filesModuleConfig,
        resolvers,
        filesModuleUseCases,
      )
    }

    async checkArInvariants(): Promise<void> {
      const files = await this.resolvers.moduleResolver.db.getFiles();
      files.forEach(attrs => new FileAr(attrs));
    }

    protected makeController(): void {
      this.controller = new FileModuleController(this);
    }
}

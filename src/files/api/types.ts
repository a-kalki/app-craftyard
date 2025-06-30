import type { CraftYardServerResolver } from "#app/api/resolvers"
import type { FileRepo } from "#files/domain/repo"
import type { formFileName } from "../constants"

export type FilesModuleResolver = {
  fileRepo: FileRepo,
  fileDir: string,
  fileUrlPath: string,
  formFieldName: typeof formFileName,
}

export type FilesModuleResolvers = {
  serverResolver: CraftYardServerResolver,
  moduleResolver: FilesModuleResolver
}

export type FilesModuleMeta = {
  name: "Files Module",
  resolvers: FilesModuleResolvers
}

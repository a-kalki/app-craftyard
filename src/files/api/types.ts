import type { CreaftYardServerResolver } from "#app/api/server-resolver"
import type { FileRepo } from "#app/domain/file/repo"
import type { formFileName } from "../constants"

export type FilesModuleResolver = {
  db: FileRepo,
  fileDir: string,
  fileUrlPath: string,
  formFieldName: typeof formFileName,
}

export type FilesModuleResolvers = {
  serverResolver: CreaftYardServerResolver,
  moduleResolver: FilesModuleResolver
}

export type FilesModuleMeta = {
  name: "Files Module",
  resolvers: FilesModuleResolvers
}

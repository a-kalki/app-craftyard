import { QueryUseCase, type DomainResult, type RequestScope } from "rilata/api";
import type { AppAboutContentType, GetAppAboutContentCommand, GetAppAboutContentMeta } from "./contract";
import type { AppAboutModuleResolvers } from "../types";
import { getAppAboutContentValidator } from "./v-map";
import { success } from 'rilata/core';
import path from 'path';

const cached: Partial<Record<AppAboutContentType, string>> = {}

const currFilePath = import.meta.dir;

export class GetAppAboutContentUseCase extends QueryUseCase<
  AppAboutModuleResolvers,
  GetAppAboutContentMeta
> {
    arName = 'AppAboutAr';

    name = "Get App About Content Use Case" as const;

    inputName = "get-app-about-content" as const;

    protected supportAnonimousCall = true;

    protected validator = getAppAboutContentValidator;

    async runDomain(
      input: GetAppAboutContentCommand, reqScope: RequestScope
    ): Promise<DomainResult<GetAppAboutContentMeta>> {

      const cachedValue = cached[input.attrs.contentType];
      if (cachedValue) return success(cachedValue);

      const contentDirPath = path.join(currFilePath, '..', 'contents');
      const fullContentPath = path.join(contentDirPath, `${input.attrs.contentType}.md`);
      try {
        const content = await Bun.file(fullContentPath).text();
        cached[input.attrs.contentType] = content;
        return success(content);
      } catch (error) {
        throw this.logger.error(
          `[${this.constructor.name}]: Файл "${fullContentPath}" не найден.`,
          { error }
        );
      }
    }

}

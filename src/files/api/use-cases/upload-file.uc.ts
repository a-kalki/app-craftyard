import path from "node:path";
import { mkdirSync } from 'fs';
import type { RequestScope, DomainResult } from "rilata/api";
import { AssertionException, failure, success } from "rilata/core";
import { FileUseCase } from "../base-uc";
import { uuidUtility } from "rilata/api-helper";
import type { UploadFileCommand, UploadFileUcMeta } from "#files/domain/struct/upload-file/contract";
import type { FileEntryAttrs } from "#files/domain/struct/attrs";
import { FileAr } from "#files/domain/a-root";
import { uploadFileValidator } from "#files/domain/struct/upload-file/v-map";

export class UploadFileUC extends FileUseCase<UploadFileUcMeta> {
  arName = "FileEntryAr" as const;

  name = "Upload File Use Case" as const;

  inputName = "upload-file" as const;

  protected supportAnonimousCall = false;

  protected validator = uploadFileValidator;

  async runDomain(
    input: UploadFileCommand, reqScope: RequestScope,
  ): Promise<DomainResult<UploadFileUcMeta>> {
    const id = uuidUtility.getNewUuidV7();
    const canPerform = await this.canPerform({ id, ...input.attrs.entryData }, reqScope);
    if (!canPerform) {
      return failure({
        name: 'AddingIsNotPermittedError',
        description: 'Создание (добавление) файла не разрешено.',
        type: 'domain-error',
      });
    }

    const { file, size, mimeType, name } = input.attrs.fileData;
    const { comment, access, context, ownerName, ownerId } = input.attrs.entryData;
    if (!(file instanceof ReadableStream)) {
      return failure({
        name: 'Bad file Error',
        description: 'Полученный данные не являются файлом.',
        type: 'domain-error',
      })
    }

    try {
      const extension = path.extname(name);
      const uuidFileName = `/${id}${extension}`;
      const contexDir = `/${context}`;
      const destinationDir = path.join(this.moduleResolver.fileDir, contexDir);
      mkdirSync(path.dirname(destinationDir), { recursive: true });
      const destinationPath = path.join(destinationDir, uuidFileName);

      await this.saveToFile(file, destinationPath);

      const url = `${this.moduleResolver.fileUrlPath}${contexDir}${uuidFileName}`.replace(/\/+/g, '/');
      const fileEntry: FileEntryAttrs = {
          id,
          url,
          mimeType,
          size,
          ownerId,
          ownerName,
          access,
          context,
          comment,
          uploadedAt: Date.now(),
      }
      new FileAr(fileEntry); // checkInveriants;
      const dbResult = await this.moduleResolver.fileRepo.addFile(fileEntry);
      if (dbResult.changes === 1) {
        return success({ id, url });
      };

      throw new AssertionException(`db retruned not changes.`);
    } catch (err) {
      throw this.logger.error(
        `[${this.constructor.name}]: upload file failed.`,
        { input, reqScope },
        err as Error,
      )
    }
  }

  protected async saveToFile(file: ReadableStream, destinationPath: string): Promise<void> {
    const writer = Bun.file(destinationPath).writer();
    const reader = file.getReader();

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            writer.end();
            break;
        }
        writer.write(value);
    }
  }
}

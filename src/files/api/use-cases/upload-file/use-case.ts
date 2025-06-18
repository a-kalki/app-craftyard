import type { RequestScope, RunDomainResult } from "rilata/api";
import { AssertionException, failure, success, type AuthUser } from "rilata/core";
import { FileUseCase } from "../../base-use-case";
import { uploadFileValidator } from "./v-map";
import path from "node:path";
import { uuidUtility } from "rilata/api-helper";
import type { UploadFileCommand, UploadFileUcMeta } from "#app/domain/file/struct/upload-file";
import type { FileEntryAttrs } from "#app/domain/file/struct/attrs";
import { FileAr } from "#app/domain/file/a-root";

export class UploadFileUC extends FileUseCase<UploadFileUcMeta> {
  arName = "FileEntryAr" as const;

  name = "Upload File Use Case" as const;

  inputName = "upload-file" as const;

  protected supportAnonimousCall = false;

  protected validator = uploadFileValidator;

  async runDomain(
    input: UploadFileCommand, requestData: RequestScope,
  ): Promise<RunDomainResult<UploadFileUcMeta>> {
    const { file, comment, access } = input.attrs;

    if (!(file instanceof File)) {
      return failure({
        name: 'Bad file Error',
        description: 'Полученный данные не являются файлом.',
        type: 'domain-error',
      })
    }

    const extension = path.extname(file.name);
    const uuidFileName = `${crypto.randomUUID()}${extension}`;
    const subDir = input.attrs.subDir ?? '';
    const destinationPath = path.join(this.moduleResolver.fileDir, subDir, uuidFileName);
    const url = `${this.moduleResolver.fileUrlPath}/${subDir}/${uuidFileName}`
      .replace(/\/+/g, '/');

    await Bun.write(destinationPath, file);

    const fileEntry: FileEntryAttrs = {
        id: uuidUtility.getNewUuidV7(),
        url,
        mimeType: file.type,
        size: file.size,
        ownerId: (requestData.caller as AuthUser).id,
        access: access ?? { type: 'public' },
        comment,
        uploadedAt: Date.now(),
    }
    new FileAr(fileEntry); // checkInveriants;
    const dbResult = await this.moduleResolver.db.addFile(fileEntry);
    if (dbResult.changes === 1) {
      return success({ id: fileEntry.id })
    };

    throw new AssertionException('Failed to save file');
    console.log(`[FileUploadMiddleware] File saved: ${destinationPath}`);
  }
}

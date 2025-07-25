import { WebModuleController, type RilataRequest } from "rilata/api";
import type { FilesModule } from "./module";
import { failure, success, type BadRequestError, type Result } from "rilata/core";
import { uuidUtility } from "rilata/api-helper";
import type { UploadFileCommand } from "#files/domain/struct/upload-file/contract";
import type { CyOwnerAggregateAttrs } from "#app/core/types";

export class FileModuleController extends WebModuleController {
  declare protected module: FilesModule

  protected async getInputData(req: RilataRequest): Promise<Result<BadRequestError, unknown>> {
    if (req.method !== 'POST') {
      return failure({
        name: 'Bad request error',
        description: 'Only POST requests are allowed',
        type: 'app-error',
      });
    }

    const fileOperationHeader = req.headers.get('X-File-Operation');
    if ( fileOperationHeader !== 'upload') return super.getInputData(req);

    const url = new URL(req.url);
    const rawOwnerAttrs = url.searchParams.get('ownerAttrs');
    const comment = url.searchParams.get('comment') ?? undefined;
    const name = url.searchParams.get('name') ?? ''; // пустую строку поймает валидатор
    const size = Number(url.searchParams.get('size') ?? -1); // -1 поймает валидатор
    const mimeType = url.searchParams.get('mimeType') ?? ''; // пустую строку поймает валидатор

    if (!rawOwnerAttrs) {
      throw this.module.getLogger().error(
        `[${this.constructor}]: not find owner attrs`,
        { ownerAttrs: rawOwnerAttrs }
      );
    }
    const ownerAttrs = JSON.parse(rawOwnerAttrs) as CyOwnerAggregateAttrs;

    const inputDto: UploadFileCommand = {
      name: "upload-file",
      attrs: {
        fileData: {
          file: req.body as ReadableStream<Uint8Array>,
          size,
          mimeType,
          name,
        },
        entryData: {
          ...ownerAttrs,
          comment
        }
      },
      requestId: uuidUtility.getNewUuidV7(),
    };
    return success(inputDto);
  }
}

import { WebModuleController, type RilataRequest } from "rilata/api";
import type { FilesModule } from "./module";
import { failure, success, type BadRequestError, type OwnerAggregateAttrs, type Result } from "rilata/core";
import { uuidUtility } from "rilata/api-helper";
import type { UploadFileCommand } from "#files/domain/struct/upload-file";

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

    const contentType = req.headers.get('content-type');
    if (!contentType?.startsWith('multipart/form-data')) {
      return super.getInputData(req); // обычный json запрос
    }

    try {
      const formData = await req.formData();
      const file = formData.get(this.module.getModuleResolver().formFieldName);
      if (!file || !(file instanceof File)) {
        return failure({
          name: 'Bad request error',
          description: 'No file provided',
          type: 'app-error',
        });
      }

      const rawOwnerAttrs = formData.get('ownerAttrs') as string;
      if (!rawOwnerAttrs) {
        throw this.module.getLogger().error(
          `[${this.constructor}]: not find owner attrs`,
          { ownerAttrs: rawOwnerAttrs }
        );
      }
      const ownerAttrs = JSON.parse(rawOwnerAttrs) as OwnerAggregateAttrs;
      const inputDto: UploadFileCommand = {
        name: "upload-file",
        attrs: {
          file: file as File,
          ...ownerAttrs,
          comment: formData.get('comment') as string,
        },
        requestId: uuidUtility.getNewUuidV7(),
      }
      return success(inputDto);
    } catch (e) {
      return failure({
        name: 'Bad request error',
        type: 'app-error',
      });
    }
  }
}

import { WebModuleController, type RilataRequest } from "rilata/api";
import type { FilesModule } from "./module";
import { failure, success, type BadRequestError, type Result } from "rilata/core";
import type { UploadFileCommand } from "../domain/struct/upload-file";
import type { SubDir } from "../domain/struct/attrs";
import { uuidUtility } from "rilata/api-helper";

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

      const access = formData.get('access') as string;
      const inputDto: UploadFileCommand = {
        name: "upload-file",
        attrs: {
          file: file as File,
          access: access ? JSON.parse(access) : undefined,
          comment: formData.get('comment') as string,
          subDir: formData.get('subDir') as SubDir ,
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

import { failure, success, type JwtDecoder, type JwtDto, type ResultDTO } from "rilata/core";
import { BaseBackendApi } from "#app/ui/base/base-api";
import { fileApiUrls, formFileName } from "../constants";
import type { UiFileFacade } from "./facade";
import type { FileUploadResult, UploadFileInput, UploadFileUcMeta } from "#files/domain/struct/upload-file";
import type { GetFileCommand, GetFileEntryResult, GetFileUcMeta } from "#files/domain/struct/get-file";
import type { UpdateFileCommand, UpdateFileResult, UpdateFileUcMeta } from "#files/domain/struct/update-file";
import type { DeleteFileCommand, DeleteFileResult, DeleteFileUcMeta } from "#files/domain/struct/delete-file";
import type { CyOwnerAggregateAttrs } from "#app/domain/types";

/** Реализация для файлового хранилища сохраняющего прямо на сервере (не в s3) */
export class FileBackendLocalApi extends BaseBackendApi<unknown> implements UiFileFacade {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(fileApiUrls, jwtDecoder, cacheTtlAsMin);
  }

  // выполняется в обход метода request в связи с отправкой файла
  async uploadFile(options: UploadFileInput): Promise<FileUploadResult> {
    try {
      const token = this.accessToken;
      if (token && this.jwtDecoder.dateIsExpired(token)) {
        if (!this.refreshToken || this.jwtDecoder.dateIsExpired(this.refreshToken)) {
          return failure({ name: 'Token expired error', type: 'app-error' });
        }
        await this.updateAccessToken();
      }

      const { file, comment, onProgress } = options;
      const ownerAttrs: CyOwnerAggregateAttrs = {
        ownerId: options.ownerId,
        ownerName: options.ownerName,
        context: options.context,
        access: options.access
      }

      const formData = new FormData();
      formData.append(formFileName, file);
      formData.append('ownerAttrs', JSON.stringify(ownerAttrs));
      if (comment) formData.append('comment', comment);

      const res = await this.sendFormDataWithProgress(formData, onProgress);
      return res.success ? success(res.payload) : failure(res.payload);
    } catch (err) {
      return failure({
        name: 'Internal error',
        description: 'При загрузке файла произошла ошибка',
        type: 'app-error',
      });
    }
  }

  async getFile(id: string): Promise<GetFileEntryResult> {
    const command: GetFileCommand = {
      name: 'get-file',
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    return this.request<GetFileUcMeta>(command);
  }

  async updateFile(id: string, patch: UpdateFileCommand['attrs']['patch']): Promise<UpdateFileResult> {
    const command: UpdateFileCommand = {
       name: 'update-file',
       attrs: { id, patch },
       requestId: crypto.randomUUID()
    }
    return this.request<UpdateFileUcMeta>(command);
  }

  async deleteFile(id: string): Promise<DeleteFileResult> {
    const command: DeleteFileCommand = {
      name: "delete-file", attrs: { id }, requestId: crypto.randomUUID()
    }
    return this.request<DeleteFileUcMeta>(command);
  }

  protected sendFormDataWithProgress(
    formData: FormData,
    onProgress?: (progress: number) => void,
  ): Promise<ResultDTO<UploadFileUcMeta['errors'], UploadFileUcMeta['success']>>  {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', this.moduleUrl);
      if (this.accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      };

      xhr.onload = () => {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      xhr.onerror = () => {
        reject(new Error('File upload failed'));
      };

      xhr.send(formData);
    });
  }
}

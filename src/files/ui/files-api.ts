import { failure, success, type JwtDecoder, type JwtDto, type ResultDTO } from "rilata/core";
import { BaseBackendApi } from "#app/ui/base/base-api";
import { fileApiUrls } from "../constants";
import type { UiFileFacade } from "./facade";
import type { FileUploadResult, UploadFileInput, UploadFileUcMeta } from "#files/domain/struct/upload-file/contract";
import type { GetFileCommand, GetFileEntryResult, GetFileUcMeta } from "#files/domain/struct/get-file/contract";
import type { UpdateFileCommand, UpdateFileResult, UpdateFileUcMeta } from "#files/domain/struct/update-file/contract";
import type { DeleteFileCommand, DeleteFileResult, DeleteFileUcMeta } from "#files/domain/struct/delete-file/contract";
import type { CyOwnerAggregateAttrs } from "#app/core/types";
import type { GetFilesCommand, GetFilesEntryResult, GetFilesUcMeta } from "#files/domain/struct/get-files/contract";

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

      const res = await this.sendFileWithProgress(file, ownerAttrs, comment, onProgress);
      return res.success ? success(res.payload) : failure(res.payload);
    } catch (err) {
      console.log(err);
      return failure({
        name: 'Internal error',
        description: 'При загрузке файла произошла ошибка',
        type: 'app-error',
      });
    }
  }

  async getFileEntry(id: string): Promise<GetFileEntryResult> {
    const command: GetFileCommand = {
      name: 'get-file',
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    return this.request<GetFileUcMeta>(command);
  }

  async getFileEntries(ids: string[]): Promise<GetFilesEntryResult> {
    const command: GetFilesCommand = {
      name: 'get-files',
      attrs: { ids },
      requestId: crypto.randomUUID(),
    }
    return this.request<GetFilesUcMeta>(command);
  }

  async updateFileEntry(id: string, patch: UpdateFileCommand['attrs']['patch']): Promise<UpdateFileResult> {
    const command: UpdateFileCommand = {
       name: 'update-file',
       attrs: { id, patch },
       requestId: crypto.randomUUID()
    }
    return this.request<UpdateFileUcMeta>(command);
  }

  async deleteFileEntry(id: string): Promise<DeleteFileResult> {
    const command: DeleteFileCommand = {
      name: "delete-file", attrs: { id }, requestId: crypto.randomUUID()
    }
    return this.request<DeleteFileUcMeta>(command);
  }

  protected sendFileWithProgress(
    file: File,
    ownerAttrs: CyOwnerAggregateAttrs,
    comment?: string,
    onProgress?: (progress: number) => void,
  ): Promise<ResultDTO<UploadFileUcMeta['errors'], UploadFileUcMeta['success']>> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Добавляем метаданные в заголовки или URL-параметры
      const baseUrl = window.location.origin;
      const url = new URL(this.moduleUrl, baseUrl);
      url.searchParams.append('ownerAttrs', JSON.stringify(ownerAttrs));
      url.searchParams.append('name', file.name);
      url.searchParams.append('size', file.size.toString());
      url.searchParams.append('mimeType', file.type);
      if (comment) url.searchParams.append('comment', comment);

      xhr.open('POST', url.toString());
      if (this.accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
      }
      // Устанавливаем Content-Type как для бинарных данных
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream'); // Важно!
      xhr.setRequestHeader('X-File-Operation', 'upload');

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

      xhr.send(file); // Отправляем сам файл как тело запроса
    });
  }
}

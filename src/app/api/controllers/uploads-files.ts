import { exists } from 'node:fs/promises';
import { join } from 'node:path';
import { FileController } from "rilata/api";
import { responseUtility, type ResponseFileOptions } from "rilata/api-helper";

export class UploadsFilesController extends FileController {
    getUrls(): string[] | RegExp[] {
      return [new RegExp('^\/uploads\/')];
    }

    protected filePath = './src/zzz-app-run/data';

    protected fileOptions?: ResponseFileOptions | undefined;

    async execute(req: Request): Promise<Response> {
      const path = new URL(req.url).pathname;
      const filePath = join(this.projectPath, this.filePath, path);
      return responseUtility.createFileResponse(filePath, this.fileOptions);
    }
}

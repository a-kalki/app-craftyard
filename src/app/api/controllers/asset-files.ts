import { join } from 'node:path';
import { FileController } from "rilata/api";
import { responseUtility, type ResponseFileOptions } from "rilata/api-helper";

export class AssetFilesController extends FileController {
    getUrls(): string[] | RegExp[] {
      return [new RegExp('^\/assets\/')];
    }

    protected filePath = './src/zzz-app-run/public';

    protected fileOptions?: ResponseFileOptions | undefined;

    execute(req: Request): Promise<Response> {
      const path = new URL(req.url).pathname;
      const filePath = join(this.projectPath, this.filePath, path);
      return responseUtility.createFileResponse(filePath, this.fileOptions);
    }
}

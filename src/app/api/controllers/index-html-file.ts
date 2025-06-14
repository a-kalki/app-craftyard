import { FileController } from "rilata/api";
import type { ResponseFileOptions } from "rilata/api-helper";

export class IndexHtmlFileController extends FileController {
    getUrls(): string[] | RegExp[] {
      return [new RegExp('^(?!/(api|assets)(/|$)).*')];
    }

    protected filePath = './src/zzz-app-run/public/index.html';

    protected fileOptions?: ResponseFileOptions | undefined;
}

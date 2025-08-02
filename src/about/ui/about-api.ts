import type {
  AppAboutContentType, GetAppAboutContentCommand, GetAppAboutContentMeta,
} from "#about/api/use-cases/contract";
import { appAboutUrl } from "#about/constants";
import { BaseBackendApi } from "#app/ui/base/base-api";
import type { JwtUser } from "#users/domain/user/struct/attrs";
import type { BackendResultByMeta, DTO, JwtDecoder } from "rilata/core";

export class AppAboutBackendApi extends BaseBackendApi<DTO> {
  constructor(jwtDecoder: JwtDecoder<JwtUser>, cacheTtlAsMin: number) {
    super(appAboutUrl, jwtDecoder, cacheTtlAsMin)
  }

  getContent(contentType: AppAboutContentType): Promise<BackendResultByMeta<GetAppAboutContentMeta>> {
    const command: GetAppAboutContentCommand = {
      name: "get-app-about-content",
      attrs: { contentType },
      requestId: crypto.randomUUID(),
    }
    return this.request<GetAppAboutContentMeta>(command);
  }
}

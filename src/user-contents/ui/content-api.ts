import { BaseBackendApi } from "#app/ui/base/base-api";
import { userContentsApiUrls } from "#user-contents/constants";
import type { UserContent } from "#user-contents/domain/content/meta";
import type { AddUserContentCommand, AddUserContentMeta } from "#user-contents/domain/content/struct/add";
import type { DeleteUserContentCommand, DeleteUserContentMeta } from "#user-contents/domain/content/struct/delete";
import type { EditUserContentCommand, EditUserContentMeta } from "#user-contents/domain/content/struct/edit";
import type { GetUserContentCommand, GetUserContentMeta } from "#user-contents/domain/content/struct/get";
import type { GetSectionContentsCommand, GetSectionContentsMeta, GetSectionContentsSuccess } from "#user-contents/domain/content/struct/get-section-contents";
import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";

export class UserContentApi extends BaseBackendApi<UserContent> {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(userContentsApiUrls, jwtDecoder, cacheTtlAsMin);
  }

  async addContent(attrs: AddUserContentCommand['attrs']): Promise<BackendResultByMeta<AddUserContentMeta>> {
    const command: AddUserContentCommand = {
      name: "add-content",
      attrs,
      requestId: crypto.randomUUID(),
    }
    return this.request<AddUserContentMeta>(command);
  }

  async editContent(attrs: EditUserContentCommand['attrs']): Promise<BackendResultByMeta<EditUserContentMeta>> {
    const command: EditUserContentCommand = {
      name: "edit-user-content",
      attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<EditUserContentMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(attrs.id);
      this.removeListCache();
      this.clearCacheKeysByPrefix('other_by_id_');
    }
    return result;
  }

  async deleteContent(
    attrs: DeleteUserContentCommand['attrs'],
  ): Promise<BackendResultByMeta<DeleteUserContentMeta>> {
    const command: DeleteUserContentCommand = {
      name: 'delete-user-content',
      attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<DeleteUserContentMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(attrs.contentId);
      this.removeListCache();
      this.clearCacheKeysByPrefix('other_by_id_');
    }
    return result;
  }

  async getContent(
    attrs: GetUserContentCommand['attrs'],
  ): Promise<BackendResultByMeta<GetUserContentMeta>> {
    const cached = this.getFromCacheById(attrs.contentId);
    if (cached) return success(cached);
    const command: GetUserContentCommand = {
      name: "get-user-content",
      attrs,
      requestId: crypto.randomUUID(),
    };
    const result = await this.request<GetUserContentMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(attrs.contentId ,result.value);
    }
    return result;
  }

  async getSectionContens(
    sectionId: string, forceRefresh?: boolean,
  ): Promise<BackendResultByMeta<GetSectionContentsMeta>> {
    const cached = this.getOtherFromCacheById(sectionId, 'section-contents', forceRefresh);
    if (cached) return success(cached as GetSectionContentsSuccess);
    const command: GetSectionContentsCommand = {
      name: "get-section-user-contents",
      attrs: { sectionId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetSectionContentsMeta>(command);
    if (result.isSuccess()) {
      this.setOtherCacheById(sectionId, result.value, 'section-contents');
      result.value.forEach(content => this.setCacheById(content.id, content));
    }
    return result;
  }
}

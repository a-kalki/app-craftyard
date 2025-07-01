import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";
import { BaseBackendApi } from "#app/ui/base/base-api";
import { userContentsApiUrls } from "#user-contents/constants";
import type { ContentSectionAttrs } from "#user-contents/domain/section/struct/attrs";
import type { GetContentSectionCommand, GetContentSectionMeta } from "#user-contents/domain/section/struct/get-section/contract";
import type { GetOwnerArContentSectionsCommand, GetOwnerArContentSectionsMeta } from "#user-contents/domain/section/struct/get-owner-sections/contract";
import type { AddContentSectionCommand, AddContentSectionMeta } from "#user-contents/domain/section/struct/add-section/contract";
import type { DeleteContentSectionCommand, DeleteContentSectionMeta } from "#user-contents/domain/section/struct/delete-section/contract";
import type { EditContentSectionCommand, EditContentSectionMeta } from "#user-contents/domain/section/struct/edit-section/contract";
export class ContentSectionBackendApi extends BaseBackendApi<ContentSectionAttrs> {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(userContentsApiUrls, jwtDecoder, cacheTtlAsMin);
  }

  async getContentSection(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetContentSectionMeta>> {
    const cached = this.getFromCacheById(id, forceRefresh);
    if (cached) return success(cached);

    const command: GetContentSectionCommand = {
      name: "get-content-section",
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetContentSectionMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(result.value.id, result.value)
    }
    return result;
  }

  async getOwnerArContentSection(
    ownerId: string, forceRefresh?: boolean,
  ): Promise<BackendResultByMeta<GetOwnerArContentSectionsMeta>> {
    const ownerCached = this.getOtherFromCacheById<ContentSectionAttrs[]>(
      ownerId, 'by_owner', forceRefresh,
    );
    if (ownerCached) return success(ownerCached);

    const command: GetOwnerArContentSectionsCommand = {
      name: 'get-owner-ar-content-sections',
      attrs: { ownerId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetOwnerArContentSectionsMeta>(command);
    if (result.isSuccess()) {
      // кэш для запросов по ownerId
      this.setOtherCacheById<ContentSectionAttrs[]>(ownerId, result.value, 'by_owner');
      // основной кеш: кэшируем каждый тезис-сет отдельно по его ID
      result.value.forEach(thesisSet => this.setCacheById(thesisSet.id, thesisSet))
    }
    return result;
  }

  async addContentSection(attrs: AddContentSectionCommand['attrs']): Promise<BackendResultByMeta<AddContentSectionMeta>> {
    const command: AddContentSectionCommand = {
      name: 'add-content-section',
      attrs: attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<AddContentSectionMeta>(command);
    if (result.isSuccess()) {
      this.clearCacheKeysByPrefix('other_by_id_by_owner_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка
    }
    return result;
  }

  async editContentSection(attrs: EditContentSectionCommand['attrs']): Promise<BackendResultByMeta<EditContentSectionMeta>> {
    const command: EditContentSectionCommand = {
        name: "edit-content-section",
        attrs,
        requestId: crypto.randomUUID(),
    }
    const result = await this.request<EditContentSectionMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(attrs.id!);
      this.clearCacheKeysByPrefix('other_by_id_by_owner_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка, если он есть
    }
    return result;
  }

  async deleteContentSection(id: string): Promise<BackendResultByMeta<DeleteContentSectionMeta>> {
    const command: DeleteContentSectionCommand = {
      name: "delete-content-section",
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<DeleteContentSectionMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(id);
      this.clearCacheKeysByPrefix('other_by_id_by_owner_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка
    }
    return result;
  }
}

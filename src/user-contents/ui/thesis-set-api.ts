import { success, type BackendResultByMeta, type JwtDecoder, type JwtDto } from "rilata/core";
import { BaseBackendApi } from "#app/ui/base/base-api";
import { userConentsApiUrls } from "#user-contents/constants";
import type { GetThesisSetCommand, GetThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/get";
import type { ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";
import type { GetOwnerArThesisSetsCommand, GetOwnerArThesisSetsMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/get-owner-ar-sets";
import type { AddThesisSetCommand, AddThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/add";
import type { DeleteThesisSetCommand, DeleteThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/delete";
import type { EditThesisSetCommand, EditThesisSetMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/edit";
import type { GetThesisSetContentCommand, GetThesisSetContentMeta } from "#user-contents/domain/thesis-set/struct/thesis-set/get-content";
import type { AddThesisCommand, AddThesisMeta } from "#user-contents/domain/thesis-set/struct/thesis/add";
import type { EditThesisCommand, EditThesisMeta } from "#user-contents/domain/thesis-set/struct/thesis/edit";
import type { DeleteThesisCommand, DeleteThesisMeta } from "#user-contents/domain/thesis-set/struct/thesis/delete";

export class ThesisSetBackendApi extends BaseBackendApi<ThesisSetAttrs> {
  constructor(jwtDecoder: JwtDecoder<JwtDto>, cacheTtlAsMin: number) {
    super(userConentsApiUrls, jwtDecoder, cacheTtlAsMin);
  }

  async getThesisSet(id: string, forceRefresh?: boolean): Promise<BackendResultByMeta<GetThesisSetMeta>> {
    const cached = this.getFromCacheById(id, forceRefresh);
    if (cached) return success(cached);

    const command: GetThesisSetCommand = {
      name: "get-thesis-set",
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetThesisSetMeta>(command);
    if (result.isSuccess()) {
      this.setCacheById(result.value.id, result.value)
    }
    return result;
  }

  async getOwnerArThesisSet(
    ownerId: string, forceRefresh?: boolean,
  ): Promise<BackendResultByMeta<GetOwnerArThesisSetsMeta>> {
    const ownerCached = this.getOtherFromCacheById<ThesisSetAttrs[]>(
      ownerId, 'owner_thesis_sets', forceRefresh,
    );
    if (ownerCached) return success(ownerCached);

    const command: GetOwnerArThesisSetsCommand = {
      name: 'get-owner-ar-thesis-sets',
      attrs: { ownerId },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<GetOwnerArThesisSetsMeta>(command);
    if (result.isSuccess()) {
      // кэш для запросов по ownerId
      this.setOtherCacheById<ThesisSetAttrs[]>(ownerId, result.value, 'owner_thesis_sets');
      // основной кеш: кэшируем каждый тезис-сет отдельно по его ID
      result.value.forEach(thesisSet => this.setCacheById(thesisSet.id, thesisSet))
    }
    return result;
  }

  async getContent(
    attrs: GetThesisSetContentCommand['attrs'],
  ): Promise<BackendResultByMeta<GetThesisSetContentMeta>> {
    const command: GetThesisSetContentCommand = {
      name: "get-thesis-sets-content",
      attrs,
      requestId: crypto.randomUUID(),
    }
    const a = await this.request<GetThesisSetContentMeta>(command);
    return a;
  }

  async addThesisSet(attrs: AddThesisSetCommand['attrs']): Promise<BackendResultByMeta<AddThesisSetMeta>> {
    const command: AddThesisSetCommand = {
      name: 'add-thesis-set',
      attrs: attrs,
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<AddThesisSetMeta>(command);
    if (result.isSuccess()) {
      this.clearCacheKeysByPrefix('other_by_id_owner_thesis_sets_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка
    }
    return result;
  }

  async editThesisSet(attrs: EditThesisSetCommand['attrs']): Promise<BackendResultByMeta<EditThesisSetMeta>> {
    const command: EditThesisSetCommand = {
        name: "edit-thesis-set",
        attrs,
        requestId: crypto.randomUUID(),
    }
    const result = await this.request<EditThesisSetMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(attrs.id);
      this.clearCacheKeysByPrefix('other_by_id_owner_thesis_sets_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка, если он есть
    }
    return result;
  }

  async deleteThesisSet(id: string): Promise<BackendResultByMeta<DeleteThesisSetMeta>> {
    const command: DeleteThesisSetCommand = {
      name: "delete-thesis-set",
      attrs: { id },
      requestId: crypto.randomUUID(),
    }
    const result = await this.request<DeleteThesisSetMeta>(command);
    if (result.isSuccess()) {
      this.removeFromCacheById(id);
      this.clearCacheKeysByPrefix('other_by_id_owner_thesis_sets_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка
    }
    return result;
  }

  async addThesis(attrs: AddThesisCommand['attrs']): Promise<BackendResultByMeta<AddThesisMeta>> {
    const command: AddThesisCommand = {
      name: "add-thesis",
      attrs,
      requestId: crypto.randomUUID(),
    }
    const addResult = await this.request<AddThesisMeta>(command);
    if (addResult.isSuccess()) {
      this.removeFromCacheById(attrs.id); // удаляем данный агрегат
      this.clearCacheKeysByPrefix('other_by_id_owner_thesis_sets_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка
    }
    return addResult;
  }

  async editThesis(attrs: EditThesisCommand['attrs']): Promise<BackendResultByMeta<EditThesisMeta>> {
    const command: EditThesisCommand = {
      name: 'edit-thesis',
      attrs,
      requestId: crypto.randomUUID(),
    }
    const editResult = await this.request<EditThesisMeta>(command);
    if (editResult.isSuccess()) {
      this.removeFromCacheById(attrs.id); // удаляем данный агрегат
      this.clearCacheKeysByPrefix('other_by_id_owner_thesis_sets_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка
    }
    return editResult;
  }


  async deleteThesis(attrs: DeleteThesisCommand['attrs']): Promise<BackendResultByMeta<DeleteThesisMeta>> {
    const command: DeleteThesisCommand = {
      name: 'delete-thesis',
      attrs,
      requestId: crypto.randomUUID(),
    }
    const deleteResult = await this.request<DeleteThesisMeta>(command);
    if (deleteResult.isSuccess()) {
      this.removeFromCacheById(attrs.id); // удаляем данный агрегат
      this.clearCacheKeysByPrefix('other_by_id_owner_thesis_sets_'); // Очищаем все кэши владельцев
      this.removeListCache(); // Очищаем кэш основного списка
    }
    return deleteResult;
  }
}

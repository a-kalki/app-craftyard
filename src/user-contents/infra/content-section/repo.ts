import { JsonRepository } from "#app/infra/json-repo";
import type { ContentSectionRepo } from "#user-contents/domain/section/repo";
import type { ContentSectionAttrs } from "#user-contents/domain/section/struct/attrs";
import type { MaybePromise } from "rilata/core";

const path = import.meta.dir + '/content-section.json';

class ContentSectionJsonRepo implements ContentSectionRepo {
  protected jsonRepo: JsonRepository<ContentSectionAttrs>;

  constructor() {
    this.jsonRepo = new JsonRepository(path);
  }

  getOwnerArContentSections(ownerId: string): MaybePromise<ContentSectionAttrs[]> {
    return this.jsonRepo.filter({ ownerId })
  }

  async findContentSection(id: string): Promise<ContentSectionAttrs | undefined> {
    return this.jsonRepo.find(id);
  }

  async addContentSection(attrs: ContentSectionAttrs): Promise<{ changes: number }> {
    const exist = await this.jsonRepo.find(attrs.id);
    if (exist) {
      throw new Error('Content section already exists');
    }
    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }

  async getContentSections(): Promise<ContentSectionAttrs[]> {
    return this.jsonRepo.getAll();
  }

  async updateContentSection(id: string, attrs: ContentSectionAttrs): Promise<{ changes: number }> {
    const existing = await this.jsonRepo.find(id);
    if (!existing) {
      throw Error('Content section not exist');
    }

    await this.jsonRepo.update(id, attrs);
    return { changes: 1 };
  }

  deleteContentSection(id: string): MaybePromise<{ changes: number; }> {
    return this.jsonRepo.delete(id);
  }
}

export const contentSectionJsonRepo = new ContentSectionJsonRepo();

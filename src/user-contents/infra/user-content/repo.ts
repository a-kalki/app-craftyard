import { JsonRepository } from "#app/infra/json-repo";
import type { UserContent } from "#user-contents/domain/content/meta";
import type { UserContentRepo } from "#user-contents/domain/content/repo";
import type { MaybePromise } from "rilata/core";

const path = import.meta.dir + '/user-contents.json';

class UserContentJsonRepo implements UserContentRepo {
  protected jsonRepo: JsonRepository<UserContent>;

  constructor() {
    this.jsonRepo = new JsonRepository(path);
  }

  findContent<C extends UserContent>(id: string): Promise<C | undefined> {
    return this.jsonRepo.find(id) as Promise<C | undefined>;
  }

  filterContent<C extends UserContent>(filterAttrs: Partial<C>): Promise<C[]> {
    if (Object.keys(filterAttrs).length === 0)
      return this.jsonRepo.getAll() as Promise<C[]>;
    return this.jsonRepo.filter(filterAttrs) as Promise<C[]>;
  }

  async addContent<C extends UserContent>(attrs: C): Promise<{ changes: number; }> {
    const exist = await this.jsonRepo.find(attrs.id);
    if (exist) {
      throw new Error('User content already exists');
    }
    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }

  async updateContent<C extends UserContent>(attrs: C): Promise<{ changes: number; }> {
    const existing = await this.jsonRepo.find(attrs.id!);
    if (!existing) {
      throw Error('User content not exist');
    }

    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }

  deleteContent(id: string): MaybePromise<{ changes: number; }> {
    return this.jsonRepo.delete(id);
  }
}

export const userContentJsonRepo = new UserContentJsonRepo();


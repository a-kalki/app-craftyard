import { JsonRepository } from "#app/infra/json-repo";
import type { ThesisSetRepo } from "#user-contents/domain/thesis-set/repo";
import type { ThesisSetAttrs } from "#user-contents/domain/thesis-set/struct/attrs";
import type { MaybePromise } from "rilata/core";

const path = import.meta.dir + '/thesis-sets.json';

class ThesisSetJsonRepo implements ThesisSetRepo {
  protected jsonRepo: JsonRepository<ThesisSetAttrs>;

  constructor() {
    this.jsonRepo = new JsonRepository(path);
  }

  getOwnerArThesisSets(ownerId: string): MaybePromise<ThesisSetAttrs[]> {
    return this.jsonRepo.filter({ ownerId })
  }

  async findThesisSet(id: string): Promise<ThesisSetAttrs | undefined> {
    return this.jsonRepo.find(id);
  }

  async addThesisSet(attrs: ThesisSetAttrs): Promise<{ changes: number }> {
    const exist = await this.jsonRepo.find(attrs.id);
    if (exist) {
      throw new Error('ThesisSet already exists');
    }
    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }

  async getThesisSets(): Promise<ThesisSetAttrs[]> {
    return this.jsonRepo.getAll();
  }

  async updateThesisSet(id: string, patch: Partial<ThesisSetAttrs>): Promise<{ changes: number }> {
    const existing = await this.jsonRepo.find(id);
    if (!existing) {
      throw Error('ThesisSet not exist');
    }

    const updated = { ...existing, ...patch };
    await this.jsonRepo.update(id, updated);
    return { changes: 1 };
  }

  deleteThesisSet(id: string): MaybePromise<{ changes: number; }> {
    return this.jsonRepo.delete(id);
  }
}

export const thesisSetRepo = new ThesisSetJsonRepo();

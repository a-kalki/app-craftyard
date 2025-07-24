import { JsonRepository } from "#app/infra/json-repo";
import type { ModelRepo } from "#models/domain/repo";
import type { ModelAttrs } from "#models/domain/struct/attrs";

const path = import.meta.dir + '/models.json';

class ModelsJsonRepo implements ModelRepo {
  protected jsonRepo: JsonRepository<ModelAttrs>

  constructor() {
    this.jsonRepo = new JsonRepository(path);
  }

  filter(attrs: Partial<ModelAttrs>): Promise<ModelAttrs[]> {
    return this.jsonRepo.filter(attrs);
  }

  findModel(id: string): Promise<ModelAttrs | undefined> {
    return this.jsonRepo.find(id);
  }

  async update(attrs: ModelAttrs): Promise<{ changes: number }> {
    if (!(await this.findModel(attrs.id))) {
      throw Error(`not finded model by id: ${attrs.id}`);
    }
    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }

  async add(attrs: ModelAttrs): Promise<{ changes: number }> {
    if (await this.findModel(attrs.id)) {
      throw Error(`finded model by id: ${attrs.id}`);
    }
    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }
}

export const modelsJsonRepo = new ModelsJsonRepo();

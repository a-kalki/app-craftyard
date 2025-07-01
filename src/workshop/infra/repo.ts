import { JsonRepository } from "#app/infra/json-repo";
import type { WorkshopRepo } from "#workshop/domain/repo";
import type { WorkshopAttrs } from "#workshop/domain/struct/attrs";
import type { MaybePromise } from "rilata/core";

const path = import.meta.dir + '/workshops.json';

class WorkshopsJsonRepo implements WorkshopRepo {
  protected jsonRepo: JsonRepository<WorkshopAttrs>

  constructor() {
    this.jsonRepo = new JsonRepository(path);
  }

  getWorkshops(): MaybePromise<WorkshopAttrs[]> {
    return this.jsonRepo.getAll();
  }

  async findWorkshop(id: string): Promise<WorkshopAttrs | undefined> {
    return this.jsonRepo.find(id);
  }
}

export const workshopsJsonRepo = new WorkshopsJsonRepo();

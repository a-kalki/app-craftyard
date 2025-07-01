import type { UserRepo } from "#app/domain/user/repo";
import type { UserAttrs } from "#app/domain/user/struct/attrs";
import { JsonRepository } from "../../app/infra/json-repo";

const path = import.meta.dir + '/users.json';

class UserJsonRepo implements UserRepo {
  protected jsonRepo: JsonRepository<UserAttrs>;

  constructor() {
    this.jsonRepo = new JsonRepository(path);
  }

  async findUser(id: string): Promise<UserAttrs | undefined> {
    return this.jsonRepo.find(id);
  }

  async add(attrs: UserAttrs): Promise<{ changes: number }> {
    const exist = await this.jsonRepo.find(attrs.id);
    if (exist) {
      throw new Error('User already exists');
    }
    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }

  async getUsers(): Promise<UserAttrs[]> {
    return this.jsonRepo.getAll();
  }

  async editUser(id: string, patch: Partial<UserAttrs>): Promise<{ changes: number }> {
    const existing = await this.jsonRepo.find(id);
    if (!existing) {
      throw Error('User not exist');
    }

    const updated = { ...existing, ...patch };
    await this.jsonRepo.update(id, updated);
    return { changes: 1 };
  }
}

export const usersJsonRepo = new UserJsonRepo();

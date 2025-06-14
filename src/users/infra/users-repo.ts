import type { UserAttrs } from "#users/domain/user/struct/meta";
import { JsonRepository } from "../../app/infra/json-repo";
import type { UserRepo } from "../domain/user/struct/repo";

const path = import.meta.dir + '/users.json';

class UserJsonRepo extends JsonRepository<UserAttrs> implements UserRepo {
  constructor() {
    super(path);
  }

  async findUser(id: string): Promise<UserAttrs | undefined> {
    return this.find(id);
  }

  async add(uuserDod: UserAttrs): Promise<{ changes: number }> {
    const exist = await this.find(uuserDod.id);
    if (exist) {
      throw new Error('User already exists');
    }
    await this.update(uuserDod.id, uuserDod);
    return { changes: 1 };
  }

  async getUsers(): Promise<UserAttrs[]> {
    return this.getAll(true);
  }

  async editUser(id: string, patch: Partial<UserAttrs>): Promise<{ changes: number }> {
    const existing = await this.find(id);
    if (!existing) {
      throw Error('User not exist');
    }

    const updated = { ...existing, ...patch };
    await this.update(id, updated);
    return { changes: 1 };
  }
}

export const userRepo = new UserJsonRepo();

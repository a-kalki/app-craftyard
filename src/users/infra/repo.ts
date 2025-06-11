import { JsonRepository } from "../../app/infra/json-repo";
import type { UserDod } from "../domain/user/struct/dod";
import type { UserRepo } from "../domain/user/struct/repo";

const path = import.meta.dir + '/users.json';

class UserJsonRepo extends JsonRepository<UserDod> implements UserRepo {
  constructor() {
    super(path);
  }

  async findUser(id: string): Promise<UserDod | undefined> {
    return this.find(id);
  }

  async add(uuserDod: UserDod): Promise<void> {
    const exist = await this.find(uuserDod.id);
    if (exist) {
      throw new Error('User already exists');
    }
    return this.update(uuserDod.id, uuserDod);
  }

  async getUsers(): Promise<UserDod[]> {
    return this.getAll(true);
  }

  async editUser(id: string, patch: Partial<UserDod>): Promise<void> {
    const existing = await this.find(id);
    if (!existing) {
      throw new Error('User not found');
    }

    const updated = { ...existing, ...patch };
    await this.update(id, updated);
  }
}

export const userRepo = new UserJsonRepo();

import type { UserDod } from "../../../app/app-domain/dod";
import { JsonRepository } from "../../../app/infra/json-repo";
import type { FindUserResult, RegisterUserCommand } from "./contracts";

const path = import.meta.dir + '/users.json';

class UserRepo extends JsonRepository<UserDod> {
  constructor() {
    super(path);
  }

  async findUser(id: string): Promise<FindUserResult> {
    return this.find(id);
  }

  async add(inputDto: RegisterUserCommand['dto']): Promise<void> {
    const exist = await this.find(inputDto.id);
    if (exist) {
      throw new Error('User already exists');
    }
    return this.update(inputDto.id, {
      ...inputDto,
      joinedAt: Date.now(),
    });
  }

  async getUsers(): Promise<UserDod[]> {
    return this.getAll(true);
  }
}

export const userRepo = new UserRepo();

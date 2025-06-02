import { JsonRepository } from "../../infra/json-repo";
import type { FindUserResult, RegisterUserCommand } from "./contracts";
import type { UserDod, UserRole } from "./dod";

const path = import.meta.path + '/users.json';

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
}

export const userRepo = new UserRepo();

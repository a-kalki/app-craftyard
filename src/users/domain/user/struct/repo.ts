import type { UserDod } from "./dod";

export interface UserRepo  {
  findUser(id: string): Promise<UserDod | undefined>;

  add(uuserDod: UserDod): Promise<void>;

  getUsers(): Promise<UserDod[]>;

  editUser(id: string, patch: Partial<UserDod>): Promise<void>
}

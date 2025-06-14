import type { UserAttrs } from "./user";

export interface UserRepo  {
  findUser(id: string): Promise<UserAttrs | undefined>;

  add(uuserDod: UserAttrs): Promise<{ changes: number }>;

  getUsers(): Promise<UserAttrs[]>;

  editUser(id: string, patch: Partial<UserAttrs>): Promise<{ changes: number }>
}

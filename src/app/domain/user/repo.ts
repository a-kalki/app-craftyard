import type { UserAttrs } from "./struct/attrs";

export interface UserRepo  {
  findUser(id: string): Promise<UserAttrs | undefined>;

  add(uuserDod: UserAttrs): Promise<{ changes: number }>;

  getUsers(): Promise<UserAttrs[]>;

  editUser(id: string, patch: Partial<UserAttrs>): Promise<{ changes: number }>
}

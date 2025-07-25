import type { MaybePromise } from "rilata/core";
import type { UserAttrs } from "./struct/attrs";

export interface UserRepo  {
  findUser(id: string): MaybePromise<UserAttrs | undefined>;

  add(uuserDod: UserAttrs): MaybePromise<{ changes: number }>;

  getUsers(): MaybePromise<UserAttrs[]>;

  updateUser(id: string, patch: Partial<UserAttrs>): MaybePromise<{ changes: number }>
}

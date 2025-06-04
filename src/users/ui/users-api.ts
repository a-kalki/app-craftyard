import type { UserDod } from "../../app/app-domain/dod";
import { RootApi } from "../../app/ui/base/root-api";
import { usersEndpoint } from "../domain/constants";
import type { FindUserCommand, GetUsersCommand } from "../domain/user/contracts";

class UsersApi extends RootApi {
  protected rootEndpoint = usersEndpoint

  findUser(id: string): Promise<UserDod | undefined> {
    const command: FindUserCommand = {
      command: 'find-user',
      dto: { id}
    }
    return this.post(command);
  }

  getUsers(): Promise<UserDod[]> {
    const command: GetUsersCommand = {
      command: 'get-users',
      dto: {}
    }
    return this.post(command);
  }
}

export const usersApi = new UsersApi();

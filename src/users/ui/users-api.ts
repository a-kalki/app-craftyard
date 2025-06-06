import { RootApi } from "../../app/ui/base/root-api";
import type { FindUserResult, RegisterUserDto, RegisterUserResult, UserApiInterface } from "../../app/ui/base-run/run-types";
import { usersEndpoint } from "../domain/constants";
import type {
  EditUserCommand, EditUserResult, FindUserCommand, GetUsersCommand, GetUsersResult, RegisterUserCommand 
} from "../domain/user/contracts";

class UsersApi extends RootApi implements UserApiInterface {
  protected rootEndpoint = usersEndpoint

  registerUser(dto: RegisterUserDto): Promise<RegisterUserResult> {
    const command: RegisterUserCommand = {
      command: 'register-user',
      dto
    }
    return this.post(command);
  }

  findUser(id: string): Promise<FindUserResult> {
    const command: FindUserCommand = {
      command: 'find-user',
      dto: { id}
    }
    return this.post(command);
  }

  getUsers(): Promise<GetUsersResult> {
    const command: GetUsersCommand = {
      command: 'get-users',
      dto: {}
    }
    return this.post(command);
  }

  editUser(dto: EditUserCommand['dto']): Promise<EditUserResult> {
    const command: EditUserCommand = {
      command: 'edit-user',
      dto
    }
    return this.post(command);
  }
}

export const usersApi = new UsersApi();

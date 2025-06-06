import { BaseElement } from "../../app/ui/base/base-element";
import { MyProfileEntity } from "./entities/my-profile";
import { UserCardEntity } from "./entities/user-card";
import { UserDetailsEntity } from "./entities/user-details";
import { UserEditFeature } from "./features/edit-user";
import { UsersWidget } from "./widgets/users";

export const userModuleComponentCtors: (typeof BaseElement)[] = [
  MyProfileEntity,
  UsersWidget,
  UserCardEntity,
  UserDetailsEntity,
  UserEditFeature,
]

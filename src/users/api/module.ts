import { Module } from "../../app/api/base/module";
import { usersModuleName, usersModuleTitle } from "../domain/constants";
import { usersRoot } from "./root-controller";

export const userModule = new Module(usersModuleName, usersModuleTitle, [
  usersRoot
]);

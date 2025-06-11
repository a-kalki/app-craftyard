import type { UseCase } from "rilata/api";
import type { UsersModuleResolver } from "./types";

export const usersModuleResolver: UsersModuleResolver = {
    moduleUrls: ['/users'],
    db: "Database"
}

export const usersModuleConfig = {}

export const usersModuleUseCases: UseCase[] = [

]

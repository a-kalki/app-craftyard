import { Bootstrap } from "../app/ui/base-run/bootstrap";
import type { TelegramAuthUser } from "../app/ui/base-run/run-types";
import type { ModuleManifest } from "../app/ui/base/types";
import { userModuleComponentCtors } from "../users/ui/components";
import { usersModule } from "../users/ui/module";
import { usersApi } from "../users/ui/users-api";

const debugAuthUser: TelegramAuthUser = {
  id: 773084180,
  first_name: 'Нурболат',
  username: 'anzUralsk',
  auth_date: Date.now(),
  hash: 'debug'
};

(window as any).debugAuthUser = debugAuthUser;

const manifests: ModuleManifest[] = [
  { module: usersModule, componentCtors: userModuleComponentCtors },
]

new Bootstrap(manifests, usersApi).start();


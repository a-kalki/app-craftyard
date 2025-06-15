import { workshopsModuleComponentCtors } from "#workshop/ui/components";
import { workshopsModule } from "#workshop/ui/module";
import { Bootstrap } from "../app/ui/base-run/bootstrap";
import type { TelegramWidgetUserData } from "../app/ui/base-run/run-types";
import type { ModuleManifest } from "../app/ui/base/types";
import { userModuleComponentCtors } from "../users/ui/components";
import { usersModule } from "../users/ui/module";
import { usersApi } from "../users/ui/users-api";

const debugAuthUser: TelegramWidgetUserData = {
  id: 773084180,
  first_name: 'Нурболат',
  username: 'anzUralsk',
  auth_date: Date.now() / 1000,
  hash: 'debug'
};

(window as any).debugAuthUser = debugAuthUser;

const manifests: ModuleManifest[] = [
  { module: usersModule, componentCtors: userModuleComponentCtors },
  { module: workshopsModule, componentCtors: workshopsModuleComponentCtors }
]

new Bootstrap(manifests, usersApi).start();


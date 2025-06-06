import { Bootstrap } from "../app/ui/base-run/bootstrap";
import type { ModuleManifest } from "../app/ui/base/types";
import { userModuleComponentCtors } from "../users/ui/components";
import { usersModule } from "../users/ui/module";
import { usersApi } from "../users/ui/users-api";

const manifests: ModuleManifest[] = [
  { module: usersModule, componentCtors: userModuleComponentCtors },
]

new Bootstrap(manifests, usersApi).start();


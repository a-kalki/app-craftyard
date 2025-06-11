import { DedokServer } from "./server";
import { getServerConfig, InjectCallerMiddleware, LogResponseAfterware, ServerAfterware, ServerMiddleware } from "rilata/api-server";
import { dedokServerResolver } from "./resolver";
import { WebModuleController, type Controller, type Module, type ModuleMeta } from "rilata/api";
import { UsersModule } from "#users/api/module";
import { usersModuleConfig, usersModuleResolver } from "#users/api/resolver";

const middlewares: ServerMiddleware[] = [
  new InjectCallerMiddleware(dedokServerResolver)
];

const afterwares: ServerAfterware[] = [
  new LogResponseAfterware(dedokServerResolver.logger)
]

const modules: Module<ModuleMeta>[] = [
  new UsersModule(
    usersModuleConfig,
    {
      moduleResolver: usersModuleResolver,
      serverResolver: dedokServerResolver,
    },

  )
]

const controllers: Controller[] = [

]

const server = new DedokServer(
  getServerConfig(),
  dedokServerResolver,
  modules,
  middlewares,
  afterwares,
  controllers,
);

server.start();


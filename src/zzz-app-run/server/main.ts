import { cwd } from "process";
import { DedokServer } from "./server";
import { dedokServerResolver } from "./resolver";
import { UsersModule } from "#users/api/module";
import { getServerConfig, InjectCallerMiddleware, LogResponseAfterware, ServerAfterware, type ServerMiddleware } from "rilata/api-server";
import type { Controller, Module, ModuleMeta } from "rilata/api";
import { userModuleResolvers } from "./module-resolvers";
import { IndexHtmlFileController } from "#app/api/controllers/index-html-file";
import { AssetFilesController } from "#app/api/controllers/asset-files";
import {} from '../../app/bot/app.ts';

const PROJECT_PATH = cwd();

const middlewares: ServerMiddleware[] = [
  new InjectCallerMiddleware(dedokServerResolver.jwtVerifier)
];

const afterwares: ServerAfterware[] = [
  new LogResponseAfterware(dedokServerResolver.logger)
]

const modules: Module<ModuleMeta>[] = [
  new UsersModule(userModuleResolvers)
]

const controllers: Controller[] = [
  new AssetFilesController(PROJECT_PATH),
  new IndexHtmlFileController(PROJECT_PATH),
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


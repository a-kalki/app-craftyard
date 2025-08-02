import { cwd } from "process";
import { CraftyardServer } from "./server";
import { craftYardServerResolver } from "./server-resolver.ts";
import { getServerConfig, InjectCallerMiddleware, LogResponseAfterware, ServerAfterware, type ServerMiddleware } from "rilata/api-server";
import type { Controller, Module, ModuleMeta } from "rilata/api";
import {
    appAboutBackendModule,
  cooperationBackendModule, filesBackendModule, modelBackendModule, offerBackendModule,
  userBackendModule, userContentsBackendModule, workshopBackendModule,
} from "./module-resolvers";
import { IndexHtmlFileController } from "#app/api/controllers/index-html-file";
import { AssetFilesController } from "#app/api/controllers/asset-files";
import {} from '../../app/bot/app.ts';
import { UploadsFilesController } from "#app/api/controllers/uploads-files.ts";
import { maxFileSizeByte } from "#files/constants.ts";

const PROJECT_PATH = cwd();

const middlewares: ServerMiddleware[] = [
  new InjectCallerMiddleware(craftYardServerResolver.jwtVerifier)
];

const afterwares: ServerAfterware[] = [
  new LogResponseAfterware(craftYardServerResolver.logger)
]

const modules: Module<ModuleMeta>[] = [
  filesBackendModule,
  userContentsBackendModule,
  userBackendModule,
  workshopBackendModule,
  modelBackendModule,
  offerBackendModule,
  cooperationBackendModule,
  appAboutBackendModule,
]

const controllers: Controller[] = [
  new UploadsFilesController(PROJECT_PATH),
  new AssetFilesController(PROJECT_PATH),
  new IndexHtmlFileController(PROJECT_PATH),
]

const server = new CraftyardServer(
  getServerConfig({ maxUploadFileSizeByte: maxFileSizeByte }),
  craftYardServerResolver,
  modules,
  middlewares,
  afterwares,
  controllers,
);

server.start();


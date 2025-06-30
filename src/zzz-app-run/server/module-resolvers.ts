import { cwd } from 'process';
import type { ModelModuleResolvers } from "#models/api/types";
import { modelsRepo } from "#models/infra/repo";
import type { UsersModuleResolvers } from "#users/api/types";
import { usersRepo } from "#users/infra/repo";
import type { WorkshopsModuleResolvers } from "#workshop/api/types";
import { workshopsRepo } from "#workshop/infra/repo";
import type { FilesModuleResolvers } from "src/files/api/types";
import { fileRepo } from "src/files/infra/repo";
import { join } from 'path';
import { existsSync } from 'fs';
import { craftYardServerResolver } from './server-resolver';
import { FilesModule } from '#files/api/module';
import { UsersModule } from '#users/api/module';
import { WorkshopsModule } from '#workshop/api/module';
import { ModelModule } from '#models/api/module';
import { UserContentModule } from '#user-contents/api/module';
import type { UserContentModuleResolvers } from '#user-contents/api/types';
import { thesisSetRepo } from '#user-contents/infra/thesis-set/repo';
import { FileModuleBackendFacade } from '#files/api/facade';

const PROJECT_PATH = cwd();
const PATH_TO_UPLOADS = join(PROJECT_PATH, 'src/zzz-app-run/data/uploads');

function setUploadDir(): void {
  if (!existsSync(PATH_TO_UPLOADS)) {
    throw Error('Uploads path does not exist: ' + PATH_TO_UPLOADS);
  }
}

setUploadDir();

// +++++++++++++ files module ++++++++++++++
export const fileModuleResolvers: FilesModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    fileRepo: fileRepo,
    fileDir: PATH_TO_UPLOADS,
    fileUrlPath: '/uploads',
    formFieldName: 'file'
  }
}

export const filesBackendModule = new FilesModule(fileModuleResolvers);

// +++++++++++++ user-content module ++++++++++++++
export const userContentModuleResolvers: UserContentModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    thesisSetRepo: thesisSetRepo
  }
}

export const userContentsBackendModule = new UserContentModule(userContentModuleResolvers);

// +++++++++++++ users module ++++++++++++++
export const userModuleResolvers: UsersModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    userRepo: usersRepo
  }
}

export const userBackendModule = new UsersModule(userModuleResolvers);

// +++++++++++++ workshops module ++++++++++++++
export const workshopModuleResolvers: WorkshopsModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    workshopRepo: workshopsRepo
  }
}

export const workshopBackendModule = new WorkshopsModule(workshopModuleResolvers);

// +++++++++++++ model module ++++++++++++++
export const modelModuleResolvers: ModelModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    modelRepo: modelsRepo,
    fileFacade: new FileModuleBackendFacade(filesBackendModule),
  }
}

export const modelBackendModule = new ModelModule(modelModuleResolvers);

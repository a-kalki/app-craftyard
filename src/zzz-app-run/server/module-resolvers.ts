import { cwd } from 'process';
import type { ModelModuleResolvers } from "#models/api/types";
import { modelsJsonRepo } from "#models/infra/repo";
import type { UsersModuleResolvers } from "#users/api/types";
import { usersJsonRepo } from "#users/infra/repo";
import type { WorkshopsModuleResolvers } from "#workshop/api/types";
import { workshopsJsonRepo } from "#workshop/infra/repo";
import type { FilesModuleResolvers } from "src/files/api/types";
import { fileJsonRepo } from "src/files/infra/repo";
import { join } from 'path';
import { existsSync } from 'fs';
import { craftYardServerResolver } from './server-resolver';
import { FilesModule } from '#files/api/module';
import { UsersModule } from '#users/api/module';
import { WorkshopsModule } from '#workshop/api/module';
import { ModelModule } from '#models/api/module';
import { UserContentModule } from '#user-contents/api/module';
import type { UserContentModuleResolvers } from '#user-contents/api/types';
import { FileModuleBackendFacade } from '#files/api/facade';
import { contentSectionJsonRepo } from '#user-contents/infra/content-section/repo';
import { userContentJsonRepo } from '#user-contents/infra/user-content/repo';
import type { OfferModuleResolvers } from '#offer/api/types';
import { offerJsonRepo } from '#offer/infra/repo';
import { WorkshopBackendFacade } from '#workshop/api/facade';
import { OfferModule } from '#offer/api/module';
import type { CooperationModuleResolvers } from '#cooperation/api/types';
import { cooperationJsonRepo } from '#cooperation/infra/repo';
import { CooperationModule } from '#cooperation/api/module';
import { ModelBackendFacade } from '#models/api/facade';
import { ApiUserContendSectionMonolithFacade } from '#user-contents/infra/monolith-facade';
import { UsersBackendFacade } from '#users/api/backend-facade';

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
    fileRepo: fileJsonRepo,
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
    contentSectionRepo: contentSectionJsonRepo,
    userContentRepo: userContentJsonRepo,
  }
}

export const userContentsBackendModule = new UserContentModule(userContentModuleResolvers);

export const userContentApiFacade = new ApiUserContendSectionMonolithFacade(userContentsBackendModule);

// +++++++++++++ users module ++++++++++++++
export const userModuleResolvers: UsersModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    userContentFacade: userContentApiFacade,
    userRepo: usersJsonRepo
  }
}

export const userBackendModule = new UsersModule(userModuleResolvers);

// +++++++++++++ workshops module ++++++++++++++
export const workshopModuleResolvers: WorkshopsModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    workshopRepo: workshopsJsonRepo
  }
}

export const workshopBackendModule = new WorkshopsModule(workshopModuleResolvers);

export const workshopModuleFacade = new WorkshopBackendFacade(workshopBackendModule);

// +++++++++++++ model module ++++++++++++++
export const modelModuleResolvers: ModelModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    modelRepo: modelsJsonRepo,
    fileFacade: new FileModuleBackendFacade(filesBackendModule),
    userFacade: new UsersBackendFacade(userBackendModule)
  }
}

export const modelBackendModule = new ModelModule(modelModuleResolvers);

export const modelFacade = new ModelBackendFacade(modelBackendModule);

// +++++++++++++ offers module ++++++++++++++
export const offerModuleResolvers: OfferModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    offerRepo: offerJsonRepo,
    workshopFacade: workshopModuleFacade,
    modelFacade: modelFacade
  }
}

export const offerBackendModule = new OfferModule(offerModuleResolvers);

// +++++++++++++ cooperation module ++++++++++++++
export const cooperationModuleResolvers: CooperationModuleResolvers = {
  serverResolver: craftYardServerResolver,
  moduleResolver: {
    cooperationRepo: cooperationJsonRepo
  }
}

export const cooperationBackendModule = new CooperationModule(cooperationModuleResolvers);

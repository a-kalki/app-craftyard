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
import { existsSync, mkdirSync } from 'fs';
import { fileSubDirs } from 'src/files/constants';
import { craftYardServerResolver } from './server-resolver';

const PROJECT_PATH = cwd();
const PATH_TO_UPLOADS = join(PROJECT_PATH, 'src/zzz-app-run/data/uploads');

function setUploadDir(): void {
  if (!existsSync(PATH_TO_UPLOADS)) {
    throw Error('Uploads path does not exist: ' + PATH_TO_UPLOADS);
  }

  for (const dir of fileSubDirs) {
    const subPath = join(PATH_TO_UPLOADS, dir);
    if (!existsSync(subPath)) {
      mkdirSync(subPath, { recursive: true });
    }
  }
}

setUploadDir();

export const fileModuleResolvers: FilesModuleResolvers = {
    serverResolver: craftYardServerResolver,
    moduleResolver: {
        db: fileRepo,
        fileDir: PATH_TO_UPLOADS,
        fileUrlPath: '/uploads',
        formFieldName: 'file'
    }
}

export const userModuleResolvers: UsersModuleResolvers = {
    serverResolver: craftYardServerResolver,
    moduleResolver: {
        db: usersRepo
    }
}

export const workshopModuleResolvers: WorkshopsModuleResolvers = {
    serverResolver: craftYardServerResolver,
    moduleResolver: {
        db: workshopsRepo
    }
}

export const modelModuleResolvers: ModelModuleResolvers = {
    serverResolver: craftYardServerResolver,
    moduleResolver: {
        db: modelsRepo
    }
}

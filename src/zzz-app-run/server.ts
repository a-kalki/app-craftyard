import { join } from 'path';
import type { Module } from "../app/api/base/module";
import { Server } from "../app/api/base/server";
import { userModule } from '../users/api/module';

const PUBLIC_DIR = join(import.meta.dir, './public');

class DedokServer extends Server {
  protected modules: Module[] = [
    userModule
  ];
}

const server = new DedokServer()
server.init()
server.start(PUBLIC_DIR);

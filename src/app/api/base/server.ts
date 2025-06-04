import { serve } from 'bun';
import { join } from 'path';
import {} from '../../../app/bot/app'
import type { Command } from './types';
import type { Module } from './module';
import type { BaseService } from './service';

const PORT = 8000;

let self: Server;

type RootServices = Record<string, BaseService<Command>[]>;

export abstract class Server {
  protected abstract modules: Module[];

  protected rootServices: RootServices = {};

  constructor() {
    self = this;
  }

  init(): void {
    this.modules.forEach(m => {
      return m.rootControllers.forEach(c => this.rootServices[c.rootEndpoint] = c.services)
    });
  }

  start(publicDir: string, port?: number): void {
    port = port ?? PORT;

    serve({
      port: port,
      async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;
        let status = 200;
        let filePath: string;

        try {
          if (path.startsWith('/api')) {
            if (req.method !== 'POST') {
              throw Error('not supported method: ' + req.method);
            }
            return self.handleApi(path, await req.json())
          }
          else if (path.startsWith('/bot')) {
            throw Error('not implemented');
          }
          else if (path === '/favicon.ico') {
            filePath = join(publicDir, path);
          }
          else if (path.startsWith('/assets')) {
            filePath = join(publicDir, path);
          }
          else {
            filePath = join(publicDir, '/index.html');
          }

          const file = Bun.file(filePath);
          return new Response(file);
        } catch (e) {
          console.log('error: ', e);
          status = 500;
          return new Response('Not found', { status: 500 });
        } finally {
          console.log(req.method, req.url, status);
        }

      },
    });

    console.log(`Listening on http://localhost:${port}`);
  }

  protected async handleApi(path: string, dto: Command): Promise<Response> {
    const rootName = path.split('/')[2];

    const services = this.rootServices[rootName];
    if (!services) {
      throw Error('not finded rootEndpoint: ' + rootName);
    }

    if (typeof dto.command !== 'string' || typeof dto.dto !== 'object') {
      console.log('error: bad command', dto);
      throw Error('bad command: ' + dto.command)
    }
    const service = services.find((s => s.commandName === dto.command));

    if (!service) {
      throw Error('not finded service by command name: ' + dto.command);
    }
    const result = await service.execute(dto);
    return this.toJsonResponse(result);
  }

  protected toJsonResponse(data: any): Response {
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

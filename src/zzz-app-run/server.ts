import { serve } from 'bun';
import { join } from 'path';
import {} from '../app/bot/app'
import type { Command } from '../app/api/base/types';
import type { BaseRoot } from '../app/api/base/root';

const staticDir = join(import.meta.dir, './public');

const modules: BaseRoot[] = [

]

async function handleApi(path: string, dto: Command): Promise<Response> {
  const rootName = path.split('/')[2];
  const module = modules.find(m => m.rootName === rootName);
  if (!module) {
    throw Error('not finded module: ' + rootName);
  }

  if (typeof dto.command !== 'string' || typeof dto.dto !== 'object') {
    console.log('error: bad command', dto);
    throw Error('bad command: ')
  }
  const service = module.services.find((s => s.commandName === dto.command));
  if (!service) {
    throw Error('not finded service by command name: ' + dto.command);
  }
  const result = await service.execute(dto);
  return jsonResponse(result);
}

function jsonResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

serve({
  port: 8000,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    let status;
    let filePath: string;

    try {
      if (path.startsWith('/api')) {
        if (req.method !== 'POST') {
          throw Error('not supported method: ' + req.method);
        }
        return handleApi(path, await req.json())
      }
      else if (path.startsWith('/bot')) {
        throw Error('not implemented');
      }
      else if (path === '/favicon.ico') {
        filePath = join(staticDir, path);
      }
      else if (path.startsWith('/assets')) {
        filePath = join(staticDir, path);
      }
      else {
        filePath = join(staticDir, '/index.html');
      }

      const file = Bun.file(filePath);
      status = 200;
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

console.log('Listening on http://localhost:8000');

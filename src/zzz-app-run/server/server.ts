import type { Controller, Module, ModuleMeta } from 'rilata/api';
import type { CraftyardServerMeta } from './types';
import { BunServer, ServerAfterware, ServerMiddleware, type BunServerConfig } from 'rilata/api-server';

export class CraftyardServer extends BunServer<CraftyardServerMeta> {
  name = 'Craftyard Monolith Server' as const;

  constructor(
    protected config: BunServerConfig,
    protected resolver: CraftyardServerMeta['resolver'],
    protected modules: Module<ModuleMeta>[],
    protected middlewares: ServerMiddleware[],
    protected afterwares: ServerAfterware[],
    protected serverControllers: Controller[],
  ) {
    super(config, resolver, modules);
  }
}

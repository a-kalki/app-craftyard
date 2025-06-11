import { BunServer, ServerAfterware, ServerMiddleware, type BunServerConfig } from 'rilata/api-server';
import type { DedokServerMeta } from './types';
import type { Controller, Module, ModuleMeta } from 'rilata/api';

export class DedokServer extends BunServer<DedokServerMeta> {
  name = 'Dedok Monolith Server' as const;

  constructor(
    protected config: BunServerConfig,
    protected resolver: DedokServerMeta['resolver'],
    protected modules: Module<ModuleMeta>[],
    protected middlewares: ServerMiddleware[],
    protected afterwares: ServerAfterware[],
    protected serverControllers: Controller[],
  ) {
    super(config, resolver, modules);
  }
}

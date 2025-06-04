import { LitElement } from 'lit';
import type { App } from '../base/app';
import type { RoutableElementAttrs } from './types';

export abstract class BaseElement extends LitElement {
  protected get app(): App {
    const app = (window as any).app;
    if (!app) throw new Error('App context not found');
    return app;
  }

  static routingAttrs?: RoutableElementAttrs;
}

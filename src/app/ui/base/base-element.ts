import { LitElement } from 'lit';
import type { App } from '../base/app';

export abstract class WithContextElement extends LitElement {
  protected get app(): App {
    const app = (window as any).app;
    if (!app) throw new Error('App context not found');
    return app;
  }

  protected get contentElement(): HTMLDivElement {
    const appPage = document.querySelector('app-page');
    if (!appPage) throw new Error('App page not found');
    return (appPage as any).getContentElement();
  }
}

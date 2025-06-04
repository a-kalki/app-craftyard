import type { App } from "./app";
import type { RootItem, RouteRedirect } from "./types";

export class Module {
  public app!: App;

  constructor(
    public name: string,
    public title: string,
    public rootItems: RootItem[],
    public redirects?: RouteRedirect[]
  ) {}

  init(app: App): void {
    this.app = app;
  }
};

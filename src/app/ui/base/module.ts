import type { App } from "./app";
import type { RootItem, RoutableTags, RouteRedirect } from "./types";

export class Module {
  public app!: App;

  constructor(
    public name: string,
    public title: string,
    public rootItems: RootItem[],
    public routableTags: RoutableTags[],
    public redirects?: RouteRedirect[]
  ) {}

  init(app: App): void {
    this.app = app;
  }
};

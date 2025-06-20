import type { App } from "./app";
import type { SidebarItem, RouteRedirect, RoutableCustomComponent } from "./types";

export class Module {
  public app!: App;

  constructor(
    public name: string,
    public title: string,
    public rootItems: SidebarItem[],
    public routableTags: RoutableCustomComponent[],
    public redirects?: RouteRedirect[]
  ) {}

  init(app: App): void {
    this.app = app;
  }
};

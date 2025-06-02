import type { AppState, RootItem } from "./types";
import { AppRouter } from "./app-router";
import type { Module } from "./module";
import type { UserDod } from "../../domain/user/dod";

export class App {
  public router: AppRouter;

  private modules: Module[] = [];
  private appState: AppState;

  constructor(modules: Module[], initialUser: UserDod, isMobile = false) {
    this.modules = modules;
    this.appState = {
      currentUser: initialUser,
      isMobile,
    }
    this.router = new AppRouter();
  }

  setMobileState(state: boolean): void {
    this.appState.isMobile = state;
  }

  public getState(): AppState {
    return this.appState;
  }

  public getSidebarItems(): RootItem[] {
    return this.modules.flatMap(m => m.rootItems);
  }
}

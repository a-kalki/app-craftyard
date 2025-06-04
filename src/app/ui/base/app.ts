import type { AppState, RootItem, RoutableElementAttrs, ToastVariant } from "./types";
import { AppRouter } from "./app-router";
import type { ModuleManifest } from "./run-types";
import type { UserDod } from "../../app-domain/dod";
import type { Module } from "./module";
import { AppNotifier } from "./app-notifier";

export class App {
  public router: AppRouter;

  private moduleManifests: ModuleManifest[] = [];
  private appState: AppState;
  private appNotifier = new AppNotifier();

  constructor(moduleManifests: ModuleManifest[], initialUser: UserDod) {
    this.moduleManifests = moduleManifests;
    this.appState = {
      currentUser: initialUser,
      isMobile: false,
    }
    this.router = new AppRouter();
  }

  init(): void {
    (window as any).app = this;
    this.registerRoutingComponents();
    this.registerRedirects();
    this.router.init();
    this.moduleManifests.forEach(mm => mm.module.init(this));
  }

  setMobileState(state: boolean): void {
    this.appState.isMobile = state;
  }

  info(text: string, options: { variant?: ToastVariant; details?: unknown } = {}) {
    this.appNotifier.info(text, options);
  }

  error(text: string, details?: unknown) {
    this.appNotifier.error(text, details);
  }

  public getState(copy = true): AppState {
    return copy ? { ...this.appState } : this.appState;
  }

  public getRootItems(): RootItem[] {
    return this.moduleManifests.flatMap(mm => mm.module.rootItems);
  }

  private getModules(): Module[] {
    return this.moduleManifests.flatMap(mm => mm.module);
  }

  private registerRedirects(): void {
    this.getModules().forEach(m => {
      if (m.redirects) {
        m.redirects.forEach(r => this.router.registerRedirect(r));
      }
    });
  }

  private registerRoutingComponents(): void {
    this.moduleManifests.forEach(mm => {
      mm.componentCtors.forEach(Ctor => {
        const routing = (Ctor as any).routingAttrs as RoutableElementAttrs | undefined;
        if (routing) {
          this.router.registerRoutableElement((Ctor as any).routingAttrs);
        }
      })
    })
  }
}

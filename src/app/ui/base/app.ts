import type { AppState, SidebarItem, ToastVariant } from "./types";
import { AppRouter } from "./app-router";
import type { Module } from "./module";
import { AppNotifier } from "./app-notifier";
import { AppDialog, type DialogOptions } from "./app-dialog";
import type { UserAttrs } from "#app/domain/user/struct/attrs";
import type { UiUserFacade } from "#app/domain/user/facade";
import type { BootstrapResolves } from "../base-run/run-types";

export class App {
  public router: AppRouter;

  public userFacade: UiUserFacade;

  private modules: Module[] = [];
  private appState: AppState;
  private appNotifier = new AppNotifier();
  private appDialog = new AppDialog();

  constructor(
    resolves: BootstrapResolves,
    modules: Module[],
    initialUser: UserAttrs,
    isTelegramMiniApp: boolean
  ) {
    this.userFacade = resolves.userFacade;
    this.modules = modules;
    this.appState = {
      currentUser: initialUser,
      isMobile: false,
      isTelegramMiniApp
    }
    this.router = new AppRouter();
  }

  init(): void {
    (window as any).app = this;
    this.registerRoutableComponents();
    this.registerRedirects();
    this.router.init();
    this.modules.forEach(m => m.init(this));
  }

  logout(): void {
    (window as any).app = undefined;
    window.dispatchEvent(new Event('app-logout'));
  }

  setMobileState(state: boolean): void {
    this.appState.isMobile = state;
  }

  showDialog(options: DialogOptions): Promise<boolean> {
    return this.appDialog.show(options);
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

  public getRootItems(): SidebarItem[] {
    return this.modules.flatMap(m => m.rootItems);
  }

  private getModules(): Module[] {
    return this.modules;
  }

  private registerRedirects(): void {
    this.getModules().forEach(m => {
      if (m.redirects) {
        m.redirects.forEach(r => this.router.registerRedirect(r));
      }
    });
  }

  private registerRoutableComponents(): void {
    this.modules.forEach(m => {
      m.routableTags.forEach(rt => {
        this.router.registerRoutableElement(rt);
      })
    })
  }
}

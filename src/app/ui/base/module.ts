import type { ModuleState, RootItem } from "./types";

export class Module {
  public moduleState!: ModuleState;

  constructor(public name: string, public title: string, public rootItems: RootItem[]) {}

  setModuleState(state: ModuleState): void {
    this.moduleState = state;
  }
};

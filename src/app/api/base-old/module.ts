import type { BaseRootController } from "./root-controller";

export class Module {
  constructor(public name: string, public title: string, public rootControllers: BaseRootController[]) {}
}

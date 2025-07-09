import type { Cost } from "#app/domain/types"
import type {
 Childable, CommandCooperation, Executable, Executor, Fatherble, OfferCooperation, OrganizationCooperation,
} from "../interfaces/api"
import type { CooperationValidationError } from "./types";

/** Предоставляет контекст для агрегата, чтобы он мог получить доступ к связанным узлам. */
export interface StructureContext {
  getNode(id: string): Node

  getFather(id: string): Node

  recordDistributionResult(nodeId: string, amount: Cost): void

  getFlatDistributionResults(): Map<string, Cost>
}

/** Участвуют в распределении выручки. */
export interface Distributable {
  isValid(context: StructureContext): boolean

  checkStructure(context: StructureContext): CooperationValidationError[]

  distributeProfit(amount: Cost, context: StructureContext): void;
}

/** Узел дерева */
export interface Node extends Distributable {
  getId(): string

  getTitle(): string

  getType(): string

  isChildable(): this is Childable

  isFatherable(): this is Fatherble

  isExecutable(): this is Executable

  isOrganization(): this is OrganizationCooperation

  isOffer(): this is OfferCooperation

  isCommand(): this is CommandCooperation

  isExecutor(): this is Executor
}

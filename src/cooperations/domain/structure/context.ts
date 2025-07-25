import { AssertionException, type UuidType } from "rilata/core";
import type { Node, StructureContext } from "../base/interfaces/node";
import type { Cost } from "#app/core/types";
import { costUtils } from "#app/core/utils/cost/cost-utils";

export class StructureContextObject implements StructureContext {
  protected flatDistributionResults: Map<string, Cost> = new Map();

  constructor(protected treeNodes: Map<string, Node>, protected fatherNode?: Node) {}

  getNode(id: string): Node {
    const node = this.treeNodes.get(id);
    if (!node) {
      throw new AssertionException(
        `[${this.constructor.name}]: not founded node by id: ${id}`,
      );
    }
    return node;
  }

  getFather(id: string): Node {
    if (!this.fatherNode || this.fatherNode.getId() !== id) {
      throw new AssertionException(
        `[${this.constructor.name}]: father node not setted or ids not equal. Father id: ${this.fatherNode?.getId()}; id: ${id}.`,
      );
    }
    return this.fatherNode;
  }

  /**
   * Записывает сумму прибыли, распределенную на конкретный узел.
   */
  public recordDistributionResult(nodeId: UuidType, amount: Cost): void {
    const currentAmount = this.flatDistributionResults.get(nodeId);

    if (currentAmount) {
      this.flatDistributionResults.set(nodeId, costUtils.sum(currentAmount, amount));
    } else {
      this.flatDistributionResults.set(nodeId, amount);
    }
  }

  /**
   * Возвращает плоский список результатов распределения для всех исполнителей.
   */
  public getFlatDistributionResults(): Map<UuidType, Cost> {
    return new Map(this.flatDistributionResults);
  }
}

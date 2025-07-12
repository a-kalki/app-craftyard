import { AssertionException, type UuidType } from "rilata/core";
import type { CooperationStructureValidationResult, CooperationValidationError, TreeDistributionResult } from "../base/interfaces/types";
import type { StructureContext, Node } from "../base/interfaces/node";
import type { Cost } from "#app/domain/types";
import { StructureContextObject } from "./context";
import type { CooperationType } from "../types";

/**
 * Отвечает за построение дерева из плоского списка агрегатов
 * и выполнение кросс-узловой валидации.
 */
export class CooperationStructure {
  private treeNodes: Map<string, Node>;
  private rootNode: Node;
  private fatherNode: Node | undefined;
  private context: StructureContext;
  private validationErrors: CooperationValidationError[] = [];
  private validationSysErrors: CooperationValidationError[] = [];
  private validationWarnings: CooperationValidationError[] = [];

  /**
   * @throws AssertionException если невозможно создать корректную структуру
   */
  constructor(rootNodeId: string, nodes: Node[]) {
    this.treeNodes = new Map();

    if (nodes.length === 0) {
      throw new AssertionException('COOPERATION_STRUCTURE: Cannot build structure from an empty list of nodes.');
    }
    if (!rootNodeId) {
      throw new AssertionException('COOPERATION_STRUCTURE: Root node ID must be provided.');
    }

    const foundRootNode = nodes.find(n => n.getId() === rootNodeId);
    if (!foundRootNode) {
      throw new AssertionException(
        `COOPERATION_STRUCTURE: Root node with ID "${rootNodeId}" not found in the provided nodes.`,
      );
    }
    this.rootNode = foundRootNode;

    const uniqueIds = new Set<string>();
    const fatherId = this.rootNode.isFatherable()
      ? this.rootNode.getFatherId()
      : undefined;
    for (const node of nodes) {
      if (uniqueIds.has(node.getId())) {
        throw new AssertionException(
          `COOPERATION_STRUCTURE: Duplicate node ID found in the provided list: "${node.getId()}".`,
        );
      }
      uniqueIds.add(node.getId());

      // в дерево входят только корень и его дети.
      // валидация проходит только для дерева, не проверяем отца.
      if (node.getId() === fatherId) {
        this.fatherNode = node;
      } else {
        this.treeNodes.set(node.getId(), node);
      }
    }

    this.context = new StructureContextObject(this.treeNodes, this.fatherNode);
  }

  getFlatDistributeResults(): Map<string, Cost> {
    return this.context.getFlatDistributionResults();
  }

  getTreeDistributeResults(amount: Cost): TreeDistributionResult {
    this.distributeProfit(amount);

    const flatResult = this.getFlatDistributeResults();
    const nodeResult = this.nodeDistribResult(this.rootNode, flatResult);
    if (this.fatherNode) {
      nodeResult[this.rootNode.getId()].father = {
        [this.fatherNode.getId()]: {
          title: this.fatherNode.getTitle(),
          type: this.fatherNode.getType() as CooperationType,
          inputValue: flatResult.get(this.fatherNode.getId())!,
          flowType: this.fatherNode.isExecutor() ? 'profit' : 'transit',
        }
      };
    }
    return nodeResult;
  }

  private nodeDistribResult(node: Node, flatDistribResults: Map<string, Cost>): TreeDistributionResult {
    const result: TreeDistributionResult = {};
    const childIds = node.isChildable() ? node.getChildrenIds() : undefined;
    const childsResult = childIds
      ? { childs: childIds.map(n => this.nodeDistribResult(this.getTreeNode(n)!, flatDistribResults)) }
      : {}

    result[node.getId()] = {
      title: node.getTitle(),
      type: node.getType() as CooperationType,
      inputValue: flatDistribResults.get(node.getId())!,
      flowType: node.isExecutor() ? 'profit' : 'transit',
      ...childsResult,
    }
    return result;
  }

  /** Распределить прибыль между участниками структуры. */
  public distributeProfit(amount: Cost): void {
    this.assertValid();
    this.rootNode.distributeProfit(amount, this.context);
  }

  /**
   * Возвращает результат валидации структуры, включая список ошибок и предупреждений.
   * @returns Объект с результатом валидации и списком ошибок/предупреждений.
   */
  public getValidationResult(): CooperationStructureValidationResult {
    this.validateStructure();
    const errCount = this.validationSysErrors.length + this.validationErrors.length;
    return {
      isValid: errCount === 0,
      errors: [...this.validationErrors],
      sysErrors: [...this.validationSysErrors],
      warnings: [...this.validationWarnings],
    };
  }

  /**
   * Выполняет строгую проверку валидности и бросает исключение, если есть ошибки.
   * Используется перед критическими операциями (например, распределение денег).
   * @throws AssertionException если структура невалидна (содержит ошибки).
   */
  public assertValid(): void {
    const result = this.getValidationResult();
    if (!result.isValid) {
      const errorMessages = result.errors.map(err => `[${err.errName}] ${err.nodeTitle} (ID: ${err.nodeId}): ${err.description}`).join('\n');
      throw new AssertionException(`COOPERATION_STRUCTURE: Structure is invalid:\n${errorMessages}`);
    }
  }

  public getTreeNode(nodeId: string): Node | undefined {
    return this.treeNodes.get(nodeId);
  }

  public getRootNode(): Node {
    return this.rootNode;
  }

  private validateStructure(): void {
    this.validationErrors = [];
    this.validationSysErrors = [];
    this.validationWarnings = [];

    // 1. Проверка связности всех узлов к корню и отсутствия циклических зависимостей.
    this.checkAllNodesConnectedAndNoCycles();

    // 2. Запуск проверок индивидуальных правил каждого узла.
    for (const node of this.treeNodes.values()) {
      const nodeValidationResults = node.checkStructure(this.context);
      nodeValidationResults.forEach(result => {
        if (result.type === 'error') this.addError(result);
        else if (result.type === 'system-error') this.addSystemError(result);
        else this.addWarning(result);
      });
    }

    // 3. Ищем узлы с несколькими родителями.
    this.checkMultipleParents();
  }

  /**
   * Выполняет проверку связности всех узлов к корневому
   * и отсутствия циклических зависимостей в графе.
   */
  private checkAllNodesConnectedAndNoCycles(): void {
    const visited = new Set<string>();
    const recursionStack = new Map<string, string>();

    const dfs = (node: Node, path: string[] = []): void => {
      const nodeId = node.getId();
      const nodeTitle = node.getTitle();
      // Проверяем на цикл: если узел уже в стеке рекурсии, то это цикл
      if (recursionStack.has(node.getId())) {
        const cyclePath = [...path, node.getTitle()];

        this.addError({
          nodeId,
          nodeTitle,
          errName: 'CyclicDependencyDetected',
          description: `Обнаружена циклическая зависимость, затрагивающая узел "${nodeTitle}" (ID: "${nodeId}"). Узлы контейнеров (кооперации) "${node.getType()}" не могут иметь циклические ссылки. Путь цикла: ${cyclePath.join(' -> ')}.`,
        });
        return;
      }

      // Если узел уже посещен (но не в текущем стеке рекурсии), значит, это не цикл,
      // а просто другой путь к уже пройденному узлу, будет обрабатываться в checkMultipleParents
      if (visited.has(nodeId)) {
        return;
      }

      visited.add(nodeId);
      recursionStack.set(node.getId(), nodeTitle);

      let childrenIds: string[] = [];
      if (node.isChildable()) {
        childrenIds = node.getChildrenIds();
      }

      for (const childId of childrenIds) {
        const childNode = this.resolveNode(childId, path);
        if (childNode) dfs(childNode, [...path, childNode.getTitle()]);
      }

      // Удаляем узел из стека рекурсии при выходе
      recursionStack.delete(nodeId);
    };

    dfs(this.rootNode);

    // Проверяем, что все узлы были посещены (связность с корнем).
    if (visited.size !== this.treeNodes.size) {
      const disconnectedNodes = Array.from(this.treeNodes.values()).filter(n => !visited.has(n.getId()));
      const disconnectedIds = disconnectedNodes.map(n => n.getId());
      const disconnectedTitles = disconnectedNodes.map(n => n.getTitle());
      this.addSystemError({
        nodeId: 'STRUCTURE',
        nodeTitle: 'Общая структура',
        errName: 'DisconnectedNodes',
        description: `Не все узлы подключены к корневому узлу "${this.rootNode.getTitle()}". Отключенные узлы: ${disconnectedTitles.join(', ')};\n (IDs: ${disconnectedIds.join(', ')}).`,
      });
    }
  }

  /**
   * Проверяет, что у каждого узла (кроме корня) есть только один родитель,
   * или что исполнители имеют несколько родителей (предупреждение).
   */
  private checkMultipleParents(): void {
    const childToParentsMap = new Map<UuidType, UuidType[]>();

    // Шаг 1: Заполняем карту "ребенок -> список родителей"
    this.treeNodes.forEach(node => {
      if (node.isChildable()) {
        const childableNode = node;
        for (const childId of childableNode.getChildrenIds()) {
          if (!childToParentsMap.has(childId)) {
            childToParentsMap.set(childId, []);
          }
          childToParentsMap.get(childId)!.push(node.getId());
        }
      }
    });

    // Шаг 2: Анализируем карту на наличие множественных родителей
    for (const [childId, parentIds] of childToParentsMap.entries()) {
      if (parentIds.length > 1) {
        const childNode = this.getTreeNode(childId);
        if (!childNode) {
          // Отсутствующий узел уже обработан в checkAllNodesConnectedAndNoCycles (MissingReferredNode)
          continue;
        }

        const parentTitles = parentIds
          .map(pId => this.getTreeNode(pId)?.getTitle() || 'Неизвестный узел')
          .join(', ');

        if (childNode.isExecutor()) {
          // Исполнитель может иметь несколько родителей (это предупреждение)
          this.addWarning({
            errName: 'ExecutorHasMultipleParents',
            description: `Узел "${childNode.getTitle()}" (${childId}) имеет несколько родителей: ${parentTitles}. Это допустимо, но рекомендуется для каждой роли создать свою запись исполнителя.`,
            nodeId: childId,
            nodeTitle: childNode.getTitle()
          });
        } else {
          // Контейнеры (Offer, Organization, Command) не должны иметь нескольких родителей (это ошибка)
          this.addError({
            errName: 'ContainerHasMultipleParents',
            description: `Узел кооперации ${childNode.getTitle()}(${childId}) имеет несколько родителей: ${parentTitles}. Это недопустимо, для каждого узла кооперации (команды) нужно создать свой уникальный узел.`,
            nodeId: childId,
            nodeTitle: childNode.getTitle()
          });
        }
      }
    }
  }

  private resolveNode(nodeId: string, pathes: string[]): Node | undefined {
    const node = this.treeNodes.get(nodeId);
    if (!node) {
      this.addSystemError({
        nodeId: nodeId,
        nodeTitle: 'Неизвестно',
        errName: 'MissingReferredNode',
        description: `Узел с ID "${nodeId}", на который ссылается другой узел, не найден в структуре. Ошибка найдена по пути: \n${[...pathes, nodeId].join(' => ')}.`,
      });
      return;
    }
    return node;
  }

  private addSystemError(error: Omit<CooperationValidationError, 'type'>): void {
    this.validationSysErrors.push({ ...error, type: 'system-error' });
  }

  private addError(error: Omit<CooperationValidationError, 'type'>): void {
    this.validationErrors.push({ ...error, type: 'error' });
  }

  private addWarning(warning: Omit<CooperationValidationError, 'type'>): void {
    this.validationWarnings.push({ ...warning, type: 'warning' });
  }
}

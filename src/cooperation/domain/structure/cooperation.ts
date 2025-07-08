import { AssertionException } from "rilata/core";
import type { CooperationAr } from "../types";
import type { CooperationStructureValidationResult, CooperationValidationError } from "../base/node/struct/types";
import type { CheckStructureData } from "../base/childable/struct/types";

/**
 * Отвечает за построение дерева из плоского списка агрегатов
 * и выполнение кросс-узловой валидации.
 */
export class CooperationStructure {
  private treeNodes: Map<string, CooperationAr>;
  private rootNode: CooperationAr;
  private fatherNode: CooperationAr | undefined;
  private validationErrors: CooperationValidationError[] = [];
  private validationSysErrors: CooperationValidationError[] = [];
  private validationWarnings: CooperationValidationError[] = [];

  /**
   * @throws AssertionException если невозможно создать корректную структуру
   */
  constructor(rootNodeId: string, aggregates: CooperationAr[]) {
    this.treeNodes = new Map();

    if (aggregates.length === 0) {
      throw new AssertionException('COOPERATION_STRUCTURE: Cannot build structure from an empty list of aggregates.');
    }
    if (!rootNodeId) {
      throw new AssertionException('COOPERATION_STRUCTURE: Root node ID must be provided.');
    }

    const foundRootNode = aggregates.find(ar => ar.getId() === rootNodeId);
    if (!foundRootNode) {
      throw new AssertionException(
        `COOPERATION_STRUCTURE: Root node with ID "${rootNodeId}" not found in the provided aggregates.`,
      );
    }
    this.rootNode = foundRootNode;

    const uniqueIds = new Set<string>();
    const fatherId = this.rootNode.isFatherable()
      ? this.rootNode.getAttrs().fatherId
      : undefined;
    for (const aggregate of aggregates) {
      if (uniqueIds.has(aggregate.getId())) {
        throw new AssertionException(
          `COOPERATION_STRUCTURE: Duplicate aggregate ID found in the provided list: "${aggregate.getId()}".`,
        );
      }
      uniqueIds.add(aggregate.getId());

      // в дерево входят только корень и его дети.
      // валидация проходит только для дерева, не проверяем отца.
      if (aggregate.getId() === fatherId) {
        this.fatherNode = aggregate;
      } else {
        this.treeNodes.set(aggregate.getId(), aggregate);
      }
    }
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

  public getTreeNode(nodeId: string): CooperationAr | undefined {
    return this.treeNodes.get(nodeId);
  }

  public getRootNode(): CooperationAr {
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
      const checkData = this.prepareCheckStructureData(node);
      const nodeValidationResults = node.checkStructure(checkData);
      nodeValidationResults.forEach(result => {
        if (result.type === 'error') this.addError(result);
        else if (result.type === 'system-error') this.addSystemError(result);
        else this.addWarning(result);
      });
    }
  }

  /**
   * Собирает и возвращает дочерей и родителя узла
   */
  private prepareCheckStructureData(currentNode: CooperationAr): CheckStructureData {
    if (currentNode.isExecutor()) return {};

    const childrenDistributionShares: CooperationAr[] = [];
    let fatherDistributionShare: CooperationAr | undefined = undefined;

    // Собираем данные о детях текущего узла.
    if (currentNode.isChildable()) {
      const childrenIds = currentNode.getChildrenIds();
      for (const childId of childrenIds) {
        const childNode = this.getTreeNode(childId);
        if (!childNode) continue;

        childrenDistributionShares.push(childNode);
      }
    }

    // Собираем данные о родителе текущего узла.
    if (currentNode.isFatherable()) {
      const fatherId = currentNode.getFatherId();
      if (fatherId) {
        fatherDistributionShare = this.getTreeNode(fatherId);
        if (!fatherDistributionShare && fatherId === this.fatherNode?.getId()) {
          fatherDistributionShare = this.fatherNode;
        }
      }
    }

    return {
      childrenDistributionShares,
      fatherDistributionShare,
    };
  }

  /**
   * Выполняет проверку связности всех узлов к корневому
   * и отсутствия циклических зависимостей в графе.
   */
  private checkAllNodesConnectedAndNoCycles(): void {
    const visited = new Set<string>();
    const recursionStack = new Map<string, string>();

    const dfs = (node: CooperationAr, path: string[] = []): void => {
      const { id: nodeId, title: nodeTitle } = node.getAttrs();
      // Проверяем на цикл: если узел уже в стеке рекурсии, то это цикл
      if (recursionStack.has(node.getId())) {
        const cyclePath = [...path, node.getShortName()];

        this.addError({
          nodeId,
          nodeTitle,
          errName: 'CyclicDependencyDetected',
          description: `Обнаружена циклическая зависимость, затрагивающая узел "${nodeTitle}" (ID: "${nodeId}"). Узлы контейнеров (кооперации) "${node.getType()}" не могут иметь циклические ссылки. Путь цикла: ${cyclePath.join(' -> ')}.`,
        });
        return;
      }

      // Если узел уже посещен (но не в текущем стеке рекурсии), значит, это не цикл,
      // а просто другой путь к уже пройденному узлу.
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
        if (childNode) dfs(childNode, [...path, childNode.getShortName()]);
      }

      recursionStack.delete(nodeId); // Удаляем узел из стека рекурсии при выходе
    };

    dfs(this.rootNode);

    // Проверяем, что все узлы были посещены (связность с корнем).
    if (visited.size !== this.treeNodes.size) {
      const disconnectedNodes = Array.from(this.treeNodes.values()).filter(ar => !visited.has(ar.getId()));
      const disconnectedIds = disconnectedNodes.map(ar => ar.getId());
      const disconnectedTitles = disconnectedNodes.map(ar => ar.getShortName());
      this.addSystemError({
        nodeId: 'STRUCTURE',
        nodeTitle: 'Общая структура',
        errName: 'DisconnectedNodes',
        description: `Не все узлы подключены к корневому узлу "${this.rootNode.getShortName()}". Отключенные узлы: ${disconnectedTitles.join(', ')};\n (IDs: ${disconnectedIds.join(', ')}).`,
      });
    }
  }

  private resolveNode(nodeId: string, pathes: string[]): CooperationAr | undefined {
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

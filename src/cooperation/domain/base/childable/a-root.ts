import { CooperationNodeAr } from "../node/a-root";
import type { ChildableArMeta } from "./meta";
import type { Childable } from "../node/struct/interfaces";
import type { CheckStructureData } from "./struct/types";
import type { CooperationValidationError } from "../node/struct/types";

/** Кооперация различных команд. */
export abstract class ChildableAr<META extends ChildableArMeta>
  extends CooperationNodeAr<META>
  implements Childable
{
  getChildrenIds(copy?: boolean): string[] {
    return copy ? [...this.attrs.childrenIds] : this.attrs.childrenIds;
  }

  isChildable(): this is Childable {
    return true;
  }

  checkStructure(structData: CheckStructureData): CooperationValidationError[] {
    return this.checkChildrenRules(structData)
      .concat(this.checkFatherRules(structData));
  }

  protected checkChildrenRules(structData: CheckStructureData): CooperationValidationError[] {
    if (!this.isChildable()) return [];
    const errors: CooperationValidationError[] = [];

    const childrenShares = structData.childrenDistributionShares;
    const childrenIds = this.getChildrenIds();

    // ********** sys-errors ***********
    if (!childrenShares) {
      errors.push(this.getValidationResult(
        'NotFoundChildrens',
        `[${this.getShortName} (${this.getId()})]: не найдено свойство childrenDistributionShares для валидации структуры.`,
        'system-error',
      ));
      return errors;
    }

    if (childrenShares.length !== childrenIds.length) {
      errors.push(this.getValidationResult(
        'ChildrensLengthNotEqual',
        `[${this.getShortName} (${this.getId()})]: количество детей в агрегате (${childrenIds.length}) и структуре валидации (${childrenShares.length}) не равны.`,
        'system-error',
      ));
    }

    const sharedExtraIds = new Set(childrenShares.map(ar => ar.getId()))
      .difference(new Set(childrenIds))
      .values()
      .toArray()
    const childsExtraIds = new Set(childrenIds)
      .difference(new Set(childrenShares.map(ar => ar.getId())))
      .values()
      .toArray()
    if (sharedExtraIds.length + childsExtraIds.length > 0) {
      const childIdsAsStr = childsExtraIds.length > 0
        ? `\nЛишние id в агрегате: ${childsExtraIds.values().toArray().join(', ')}.`
        : '';
      const sharedIdsAsStr = sharedExtraIds.length > 0
        ? `\nЛишние id в структуре валидации: ${childsExtraIds.values().toArray().join(', ')}.`
        : '';

      errors.push(this.getValidationResult(
        'ChildrensIdsNotEqual',
        `[${this.getShortName} (${this.getId()})]: id детей в агрегате и структуре валидации не одинаковые. ${childIdsAsStr} ${sharedIdsAsStr}`,
        'system-error',
      ));
    }

    // ********** validations ***********

    if (childrenIds.length === 0) {
      errors.push(this.getValidationResult(
        'NotFoundChildrens',
        'Узел координации должен иметь дочерние узлы.',
      ));
      return errors;
    }

    const onlyExecutors = childrenShares.every(ar => ar.isExecutable());
    if (!onlyExecutors) {
      errors.push(this.getValidationResult(
        'NotSupportedNodeType',
        'Данный узел кооперации может содержать в своих дочерних узлах только "Исполнителей" и "Кооперацию Исполнения".'
      ));
    }

    const totalShare = childrenShares
      .filter(ar => ar.isExecutable())
      .reduce((sum, ar) => sum + ar.getProfit(), 0);

    if (Math.abs(totalShare - 1.0) > 0.0001) {
      errors.push(this.getValidationResult(
        'ChildsIsNotFullPersentage',
        `Дочерние узлы должны иметь ровно 100% долей. Сейчас: ${totalShare * 100}%.`,
      ));
    }

    return errors;
  }

  protected checkFatherRules(structData: CheckStructureData): CooperationValidationError[] {
    if (!this.isFatherable()) return [];

    const errors: CooperationValidationError[] = [];

    // ********** assertions ***********
    const fatherShare = structData.fatherDistributionShare;

    const notIdsEqual = fatherShare && fatherShare.getId() !== this.getId();
    if(notIdsEqual) {
      errors.push(this.getValidationResult(
        'FatherIdNotEqual',
        `[${this.getShortName} (${this.getId()})]: id родителя в агрегате (${this.getId()}) и структуре валидации ${fatherShare.getId()} не одинаковые. `,
        'system-error',
      ));
    }

    // ********** validations ***********
    if (this.isOrganization() && !fatherShare) {
      errors.push(this.getValidationResult(
        'NotHaveNotRequiredFather',
        `У узла ${this.getShortName()} нет родительского узла, возможно надо добавить.`,
        'warning',
      ));
      return errors;
    }

    if (this.isOffer() && !fatherShare) {
      errors.push(this.getValidationResult(
        'NotHaveFatherButRequired',
        `Для узла ${this.getShortName()} должен быть указан родитель.`
      ));
      return errors;
    }

    if (!fatherShare) return []; // для очистки типа

    if (!fatherShare.isOrganization()) {
      return [this.getValidationResult(
        'NotSupportedNodeType',
        'Родительским узлом может быть только "Кооперация предприятия".'
      )];
    }

    return [];
  }
}

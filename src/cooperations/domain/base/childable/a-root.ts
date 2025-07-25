import type { Cost } from "#app/core/types";
import { AssertionException } from "rilata/core";
import type { Childable } from "../interfaces/api";
import type { StructureContext } from "../interfaces/node";
import type { CooperationValidationError } from "../interfaces/types";
import { NodeAr } from "../node/a-root";
import type { ChildableArMeta } from "./meta";
import { costUtils } from "#app/core/utils/cost/cost-utils";

/** Кооперация различных команд. */
export abstract class ChildableAr<META extends ChildableArMeta>
  extends NodeAr<META>
  implements Childable
{
  getChildrenIds(copy?: boolean): string[] {
    return copy ? [...this.attrs.childrenIds] : this.attrs.childrenIds;
  }

  isChildable(): this is Childable {
    return true;
  }

  checkStructure(context: StructureContext): CooperationValidationError[] {
    return this.checkChildrenRules(context)
      .concat(this.checkFatherRules(context));
  }

  protected distributeProfitToChilds(amount: Cost, context: StructureContext): void {
    this.getChildrenIds().forEach(id => {
      const childNode = context.getNode(id);
      if (!childNode.isExecutable()) {
        throw new AssertionException(
          `[${this.constructor.name}]: executable child not founded: ${this.getShortName()} (${this.getId()})`
        );
      }
      const childAmount = costUtils.percent(amount, childNode.getProfitProcentage());
      childNode.distributeProfit(childAmount, context);
    });
  }

  protected checkChildrenRules(context: StructureContext): CooperationValidationError[] {
    if (!this.isChildable()) return [];
    const errors: CooperationValidationError[] = [];
    const childrenIds = this.getChildrenIds();

    // ********** validations ***********
    if (childrenIds.length === 0) {
      errors.push(this.getValidationResult(
        'NotFoundChildrens',
        'Узел координации должен иметь дочерние узлы.',
      ));
      return errors;
    }

    const onlyExecutors = childrenIds.every(id => context.getNode(id).isExecutable());
    if (!onlyExecutors) {
      errors.push(this.getValidationResult(
        'NotSupportedNodeType',
        'Данный узел кооперации может содержать в своих дочерних узлах только "Исполнителей" и "Кооперацию Исполнения".'
      ));
    }

    const totalShare = childrenIds
      .map(id => context.getNode(id))
      .filter(ar => ar.isExecutable())
      .reduce((sum, ar) => sum + ar.getProfitProcentage(), 0);

    if (Math.abs(totalShare - 1.0) > 0.0001) {
      errors.push(this.getValidationResult(
        'ChildsIsNotFullPersentage',
        `Дочерние узлы должны иметь ровно 100% долей. Сейчас: ${totalShare * 100}%.`,
      ));
    }

    return errors;
  }

  protected checkFatherRules(context: StructureContext): CooperationValidationError[] {
    if (!this.isFatherable()) return [];
    const fatherId = this.getFatherId();

    const errors: CooperationValidationError[] = [];

    // ********** validations ***********
    if (this.isOrganization() && !fatherId) {
      errors.push(this.getValidationResult(
        'NotHaveNotRequiredFather',
        `У узла ${this.getShortName()} нет родительского узла, возможно надо добавить.`,
        'warning',
      ));
      return errors;
    }

    if (this.isOffer() && !fatherId) {
      errors.push(this.getValidationResult(
        'NotHaveFatherButRequired',
        `Для узла ${this.getShortName()} должен быть указан родитель.`
      ));
      return errors;
    }

    if (!fatherId) {
      // по идее сюда мы никогда не должны попасть.
      // fatherId есть в организация и офферах, оба случая мы обработали.
      throw new AssertionException(
        `[${this.constructor.name}]: fatherId is undefined!`
      )
    };
    const fatherNode = context.getFather(fatherId);
    if(!fatherNode) {
      errors.push(this.getValidationResult(
        'FatherNotFinded',
        `Не найден родитель для агрегата: ${this.getShortName()} (${this.getId()}). `,
        'system-error',
      ));
      return errors;
    }

    if (!fatherNode.isOrganization()) {
      errors.push(this.getValidationResult(
        'NotSupportedNodeType',
        'Родительским узлом может быть только "Кооперация предприятия".'
      ));
    }

    return errors;
  }
}

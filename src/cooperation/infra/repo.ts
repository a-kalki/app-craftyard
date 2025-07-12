import { AssertionException, type MaybePromise, type UuidType } from "rilata/core";
import { JsonRepository } from "#app/infra/json-repo";
import type { CooperationRepo } from "#cooperation/domain/repo";
import type { CooperationAttrs, CooperationDbo } from "#cooperation/domain/types";

const path = import.meta.dir + '/cooperations.json';

class CooperationJsonRepo implements CooperationRepo {
  protected jsonRepo = new JsonRepository<CooperationAttrs>(path);

  find(id: string): MaybePromise<CooperationAttrs | undefined> {
    return this.jsonRepo.find(id);
  }

  getAll(): MaybePromise<CooperationAttrs[]> {
    return this.filter({});
  }

  filter(attrs: Partial<CooperationAttrs>): MaybePromise<CooperationAttrs[]> {
    return this.filter(attrs);
  }

  /**
   * Получает все DBO, относящиеся к данной структуре кооперации, начиная от корневого узла.
   * Включает корневой узел, всех его потомков и непосредственного родителя корневого узла (если есть).
   * @param rootId ID корневого узла структуры.
   * @returns Promise, который разрешается в массив CooperationDbo, составляющих структуру.
   * @throws AssertionException если корневой DBO не найден.
   */
  async getRootAttrs(rootId: UuidType): Promise<CooperationAttrs[]> {
    const rootDbo = await this.jsonRepo.find(rootId) as CooperationDbo;
    if (!rootDbo) {
      throw new AssertionException(
        `[${CooperationJsonRepo}]: Корневой DBO с ID "${rootId}" не найден для извлечения структуры.`
      );
    }

    const collectedIds = new Set<UuidType>();
    const dbosToReturn: CooperationAttrs[] = [];

    if (rootDbo.fatherId) {
      collectedIds.add(rootDbo.fatherId);
    }

    // Выполняем DFS для сбора всех потомков от корня
    const stack: UuidType[] = [rootId];
    // Для предотвращения бесконечных циклов при обходе
    const visitedInTraversal = new Set<UuidType>();

    while (stack.length > 0) {
      const currentId = stack.pop()!;

      if (visitedInTraversal.has(currentId)) {
        continue;
      }
      visitedInTraversal.add(currentId);
      collectedIds.add(currentId);

      const currentDbo = await this.jsonRepo.find(currentId) as CooperationDbo;
      if (!currentDbo) {
        throw new AssertionException(
          `[${this.constructor.name}]: Ссылочный DBO с ID "${currentId}" не найден во время обхода.`,
        );
      }

      // Добавляем детей в стек
      if (currentDbo.childrenIds) {
        for (const childId of currentDbo.childrenIds) {
          if (!visitedInTraversal.has(childId)) {
            stack.push(childId);
          }
        }
      }
    }

    // Наконец, получаем все собранные DBO
    for (const id of collectedIds) {
      const dbo = await this.jsonRepo.find(id);
      if (dbo) {
        dbosToReturn.push(dbo);
      } else {
        throw new AssertionException(
          `[${this.constructor.name}]: Собранный DBO с ID "${id}" не найден во время окончательной выборки.`,
        );
      }
    }

    return dbosToReturn;
  }
}

export const cooperationJsonRepo = new CooperationJsonRepo();

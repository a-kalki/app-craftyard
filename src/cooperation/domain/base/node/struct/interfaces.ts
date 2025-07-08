/** Исполнитель, может получить свою долю выручки за свою работу */
export interface Executable {
  getProfit(): number
}

/** Конечный исполнитель. Лист в дереве.
    Имеет ссылку на представителя, конечного выгодополучателя.
    Выгодополучателем может быть как организация, так и физлицо.
*/
export interface Executor extends Executable {
  getOwnerId(): string
}

/** интерфейс кооперации, всегда имеет детей исполнителей (executable) */
export interface Childable {
  getChildrenIds(copy?: boolean): string[]
}

/** может иметь ссылку на вышенаходящися скоуп, чтобы отправить туда часть выручки */
export interface Fatherble {
  getFatherId(): string | undefined
}

/** организация или другая структура, внутри которого могут "работать" другие кооперации */
export interface OrganizationCooperation extends Fatherble, Childable {
  commissionPercentage(): number
}

/** Кооперация ответственная за выполнение предложения. Всегда имеет ссылку на организацию. */
export interface OfferCooperation extends Fatherble, Childable {}

/** Команда исполнителей и выгодополучателей. */
export interface CommandCooperation extends Executable, Childable {}

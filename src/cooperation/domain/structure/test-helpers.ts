import { OrganizationCooperationAr } from '../childables/organization/a-root';
import { OfferCooperationAr } from '../childables/offer/a-root';
import { CommandCooperationAr } from '../childables/command/a-root';
import { ExecutorAr } from '../executor/a-root';
import { uuidUtility } from "rilata/api-helper";
import type { UuidType } from "rilata/core";

// Карта для хранения ключей и соответствующих им UUID
const idMap: Map<string, UuidType> = new Map();

export function clearUuidMap(): void {
  idMap.clear();
}

export function getUuid(key: string): UuidType {
  if (!idMap.has(key)) {
    idMap.set(key, uuidUtility.getNewUuidV4());
  }
  return idMap.get(key)!;
}

// Вспомогательные функции для создания конкретных типов агрегатов для тестов
// Теперь они принимают объект с 'key' и переопределяемыми свойствами
export function createOrganization({
  key,
  commissionPercentage = 0.1,
  childrenKeys = [],
  fatherKey,
  title = `Организация ${key}`,
}: {
  key: string;
  title?: string;
  commissionPercentage?: number;
  childrenKeys?: string[];
  fatherKey?: string;
}): OrganizationCooperationAr {
  return new OrganizationCooperationAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    type: 'ORGANIZATION_COOPERATION',
    childrenIds: childrenKeys.map(key => getUuid(key)),
    commissionPercentage,
    fatherId: fatherKey ? getUuid(fatherKey) : undefined,
  });
}

export function createOffer({
  key,
  fatherKey,
  childrenKeys = [],
  title = `Предложение ${key}`,
}: {
  key: string;
  title?: string;
  childrenKeys?: string[];
  fatherKey: string;
}): OfferCooperationAr {
  return new OfferCooperationAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    type: 'OFFER_COOPERATION',
    childrenIds: childrenKeys.map(key => getUuid(key)),
    fatherId: getUuid(fatherKey),
  });
}

export function createCommand({
  key,
  childrenKeys = [],
  profitPercentage = .6,
  title = `Команда ${key}`,
}: {
  key: string;
  title?: string;
  profitPercentage?: number;
  childrenKeys?: string[];
}): CommandCooperationAr {
  return new CommandCooperationAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    type: 'COMMAND_COOPERATION',
    profitePercentage: profitPercentage,
    childrenIds: childrenKeys.map(key => getUuid(key)),
  });
}

export function createExecutor({
  key,
  profitPercentage = 1.0,
  ownerKey = 'defaultOwner',
  title = `Исполнитель ${key}`,
}: {
  key: string;
  title?: string;
  profitPercentage?: number;
  ownerKey?: string;
}): ExecutorAr {
  return new ExecutorAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    type: 'EXECUTOR',
    profitPercentage,
    ownerId: getUuid(ownerKey),
  });
}


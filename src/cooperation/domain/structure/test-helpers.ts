import { OrganizationCooperationAr } from '../childables/organization/a-root';
import { OfferCooperationAr } from '../childables/offer/a-root';
import { CommandCooperationAr } from '../childables/command/a-root';
import { ExecutorAr } from '../executor/a-root';
import { uuidUtility } from "rilata/api-helper";
import type { UuidType } from "rilata/core";
import type { CooperationStructureValidationResult } from '../base/interfaces/types';
import { expect } from 'bun:test';

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

const userId = uuidUtility.getNewUuidV4();

// Вспомогательные функции для создания конкретных типов агрегатов для тестов
// Теперь они принимают объект с 'key' и переопределяемыми свойствами
export function createOrganization({
  key,
  commissionPercentage = 0.1,
  childrenKeys = [],
  fatherKey,
  title = `Организация ${key}`,
  editorIds = [userId],
}: {
  key: string;
  title?: string;
  commissionPercentage?: number;
  childrenKeys?: string[];
  fatherKey?: string;
  editorIds?: string[];
}): OrganizationCooperationAr {
  return new OrganizationCooperationAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    editorIds: editorIds,
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
  editorIds = [userId],
}: {
  key: string;
  title?: string;
  childrenKeys?: string[];
  fatherKey: string;
  editorIds?: string[];
}): OfferCooperationAr {
  return new OfferCooperationAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    type: 'OFFER_COOPERATION',
    childrenIds: childrenKeys.map(key => getUuid(key)),
    editorIds: editorIds,
    fatherId: getUuid(fatherKey),
  });
}

export function createCommand({
  key,
  childrenKeys = [],
  profitPercentage = .6,
  title = `Команда ${key}`,
  editorIds = [userId],
}: {
  key: string;
  title?: string;
  profitPercentage?: number;
  childrenKeys?: string[];
  editorIds?: string[];
}): CommandCooperationAr {
  return new CommandCooperationAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    type: 'COMMAND_COOPERATION',
    profitePercentage: profitPercentage,
    childrenIds: childrenKeys.map(key => getUuid(key)),
    editorIds: editorIds,
  });
}

export function createExecutor({
  key,
  profitPercentage = 1.0,
  ownerKey = 'defaultOwner',
  title = `Исполнитель ${key}`,
  editorIds = [userId],
}: {
  key: string;
  title?: string;
  profitPercentage?: number;
  ownerKey?: string;
  editorIds?: string[];
}): ExecutorAr {
  return new ExecutorAr({
    id: getUuid(key),
    title,
    responsibilities: [],
    type: 'EXECUTOR',
    profitPercentage,
    ownerId: getUuid(ownerKey),
    editorIds: editorIds,
  });
}

export function expectValidationResult(
  result: CooperationStructureValidationResult,
  expectedValid: boolean,
  names: {
    expectedErrorNames?: string[],
    expectedSysErrorNames?: string[],
    expectedWarningNames?: string[],
  } = {}
): void {
  //console.log(result)

  expect(result.isValid).toBe(expectedValid);

  const actualErrorNames = result.errors.map(e => e.errName).sort();
  const actualSysErrorNames = result.sysErrors.map(s => s.errName).sort();
  const actualWarningNames = result.warnings.map(w => w.errName).sort();

  expect(actualErrorNames).toEqual((names.expectedErrorNames ?? []).sort());
  expect(actualSysErrorNames).toEqual((names.expectedSysErrorNames ?? []).sort());
  expect(actualWarningNames).toEqual((names.expectedWarningNames ?? []).sort());
};

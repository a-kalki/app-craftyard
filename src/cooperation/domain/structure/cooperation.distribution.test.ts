import { test, expect, beforeAll, afterEach, describe } from "bun:test";
import { CooperationStructure } from "./cooperation";
import {
  clearUuidMap, getUuid,
  createExecutor, createCommand, createOffer, createOrganization,
  expectValidationResult,
} from "./test-helpers";
import { costUtils } from "#app/domain/utils/cost/cost-utils";

describe('CooperationStructure Profit Distribution', () => {
  beforeAll(() => {
    // Глобальные настройки, если нужны
  });

  afterEach(() => {
    clearUuidMap(); // Очищаем UUID map между тестами
  });

  // --- Тест-кейс 1: Простое распределение на одного исполнителя ---
  test('должна правильно распределять прибыль на одного исполнителя', () => {
;   const executor1 = createExecutor({ key: 'exec1', profitPercentage: 1 });
    const command1 = createCommand({
      key: 'cmd1',
      childrenKeys: ['exec1'],
    });

    const structure = new CooperationStructure(getUuid('cmd1'), [command1, executor1]);
    const validationResult = structure.getValidationResult();
    expectValidationResult(validationResult, true);

    const initialAmount = costUtils.create(1000, 'KZT');
    structure.distributeProfit(initialAmount);

    const executorResults = structure.getFlatDistributeResults();
    expect(executorResults.size).toBe(2);
    expect(costUtils.equal(
      executorResults.get(getUuid('cmd1'))!,
      costUtils.create(1000, 'KZT')
    )).toBe(true);
    expect(costUtils.equal(
      executorResults.get(getUuid('exec1'))!,
      costUtils.create(1000, 'KZT')
    )).toBe(true);
  });

  // --- Тест-кейс 2: Распределение между несколькими исполнителями в команде ---
  test('должна правильно распределять прибыль между несколькими исполнителями в команде', () => {
    const executorA = createExecutor({ key: 'execA', profitPercentage: 0.3 }); // 30%
    const executorB = createExecutor({ key: 'execB', profitPercentage: 0.7 }); // 70%
    const command1 = createCommand({
      key: 'cmd1',
      childrenKeys: ['execA', 'execB'],
    });

    const structure = new CooperationStructure(getUuid('cmd1'), [command1, executorA, executorB]);

    const validationResult = structure.getValidationResult();
    expectValidationResult(validationResult, true);

    const initialAmount = costUtils.create(2000, 'KZT');
    structure.distributeProfit(initialAmount);

    const executorResults = structure.getFlatDistributeResults();
    expect(executorResults.size).toBe(3);
    expect(costUtils.equal(
      executorResults.get(getUuid('execA'))!,
      costUtils.create(600, 'KZT')
    )).toBe(true); // 2000 * 0.3
    expect(costUtils.equal(
      executorResults.get(getUuid('execB'))!,
      costUtils.create(1400, 'KZT')
    )).toBe(true); // 2000 * 0.7
  });

  // --- Тест-кейс 3: Сложная иерархия с комиссиями Offer и Organization ---
  test('должна правильно распределять прибыль через сложную иерархию с комиссиями', () => {
;   const executor1 = createExecutor({ key: 'exec1', profitPercentage: 0.4 });
;   const executor2 = createExecutor({ key: 'exec2', profitPercentage: 0.6 });
    const command1 = createCommand({ key: 'cmd1', childrenKeys: ['exec1', 'exec2'], profitPercentage: 0.4 });

;   const executor3 = createExecutor({ key: 'exec3', profitPercentage: .2 });
;   const executor4 = createExecutor({ key: 'exec4', profitPercentage: .8 });
    const command2 = createCommand({ key: 'cmd2', childrenKeys: ['exec3', 'exec4'] });

    const offer1 = createOffer({
      key: 'offer1',
      childrenKeys: ['cmd1', 'cmd2'],
      fatherKey: 'org1',
    });

    const organization1 = createOrganization({ key: 'org1' }); // по умолчанию 0.1

    const structure = new CooperationStructure(getUuid('offer1'), [
      organization1, offer1, command1, command2, executor1, executor2, executor3, executor4
    ]);

    const validationResult = structure.getValidationResult();
    expectValidationResult(validationResult, true);

;   const initialAmount = costUtils.create(10000, 'KZT');
    structure.distributeProfit(initialAmount);

    const flatResults = structure.getFlatDistributeResults();
;   const allNodeResults = structure.getFlatDistributeResults();

    // Ожидаемые расчеты:
    // Offer1. На входе 10000. Родителю: 10%. Детям: 9000.
    expect( allNodeResults.get(getUuid('offer1'))).toEqual(costUtils.create(10000, 'KZT'));
    // Org1 на входе: 1000. Дерево родителя не считаем.
    expect(allNodeResults.get(getUuid('org1'))).toEqual(costUtils.create(1000, 'KZT'));

    // Command1 на входе: 9000*0.4=3600. Все отправляет детям.
    expect( allNodeResults.get(getUuid('cmd1'))).toEqual(costUtils.create(3600, 'KZT'));
    // Executor1 3600*0.4=1440
    expect(flatResults.get(getUuid('exec1'))).toEqual(costUtils.create(1440, 'KZT'));
    // Executor1 3600*0.6=2160
    expect(flatResults.get(getUuid('exec2'))).toEqual(costUtils.create(2160, 'KZT'));


    // Command1 на входе: 9000*0.6=5400. Все отправляет детям.
    expect(allNodeResults.get(getUuid('cmd2'))).toEqual(costUtils.create(5400, 'KZT'));
    // Executor1 5400*0.2=1080
    expect(flatResults.get(getUuid('exec3'))).toEqual(costUtils.create(1080, 'KZT'));
    // Executor1 5400*0.8=4320
    expect(flatResults.get(getUuid('exec4'))).toEqual(costUtils.create(4320, 'KZT'));
  });

  // --- Тест-кейс 4: Executor с несколькими родителями ---
  test('должна корректно распределять прибыль на исполнителя с несколькими родителями', () => {
    const exec1 = createExecutor({ key: 'exec1', profitPercentage: .4 });
    const exec2 = createExecutor({ key: 'exec2', profitPercentage: .6 });
    const exec3 = createExecutor({ key: 'exec3', profitPercentage: .3 });
    const exec4 = createExecutor({ key: 'exec4', profitPercentage: .3 });
    const commandA = createCommand({ key: 'cmdA', childrenKeys: ['exec1', 'exec2'] });
    const commandB = createCommand({
        key: 'cmdB',
        childrenKeys: ['exec1', 'exec3', 'exec4'],
        profitPercentage: .4
    });

    const commandC = createCommand({ key: 'cmdC', childrenKeys: ['cmdA', 'cmdB'] });

    const structure = new CooperationStructure(getUuid('cmdC'), [
      commandA, commandB, commandC, exec1, exec2, exec3, exec4
    ]);

    const initialAmount = costUtils.create(5000, 'KZT'); // Общая сумма для распределения
    const validationResult = structure.getValidationResult();
    expectValidationResult(validationResult, true, {
      expectedWarningNames: ['ExecutorHasMultipleParents'], // Ожидаем предупреждение
    });

    structure.distributeProfit(initialAmount);
    const flatResults = structure.getFlatDistributeResults();

    // Ожидаемые расчеты:
    // CommandC на входе: 5000. Все отправляет детям.
    expect(flatResults.get(getUuid('cmdC'))).toEqual(costUtils.create(5000, 'KZT'));

    // CommandA на входе: 5000*0.6=3000. Все отправляет детям.
    expect(flatResults.get(getUuid('cmdA'))).toEqual(costUtils.create(3000, 'KZT'));
    // Executor1 3000*0.4=1200 + доля с cmdB
    expect(flatResults.get(getUuid('exec1'))).toEqual(costUtils.create(2000, 'KZT'));
    // Executor1 3000*0.6=1800
    expect(flatResults.get(getUuid('exec2'))).toEqual(costUtils.create(1800, 'KZT'));

    // CommandB на входе: 5000*0.4=2000. Все отправляет детям.
    expect(flatResults.get(getUuid('cmdB'))).toEqual(costUtils.create(2000, 'KZT'));
    // Executor1 2000*0.4=800 + доля cmdA
    expect(flatResults.get(getUuid('exec1'))).toEqual(costUtils.create(2000, 'KZT'));
    // Executor3 2000*0.3=600
    expect(flatResults.get(getUuid('exec3'))).toEqual(costUtils.create(600, 'KZT'));
    // Executor4 2000*0.3=600
    expect(flatResults.get(getUuid('exec4'))).toEqual(costUtils.create(600, 'KZT'));
  });
});

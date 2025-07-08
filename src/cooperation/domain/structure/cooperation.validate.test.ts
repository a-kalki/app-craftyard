import { CooperationStructure } from './cooperation';
import { beforeEach, describe, expect, test } from 'bun:test';
import type { CooperationStructureValidationResult } from '../base/node/struct/types';
import { clearUuidMap, createCommand, createExecutor, createOffer, createOrganization, getUuid } from './test-helpers';

// --- Набор тестов ---
describe('CooperationStructure', () => {
  describe('Validatrion', () => {
    // Вспомогательная функция для проверки результатов валидации
    const expectValidationResult = (
      result: CooperationStructureValidationResult,
      expectedValid: boolean,
      names: {
        expectedErrorNames?: string[],
        expectedSysErrorNames?: string[],
        expectedWarningNames?: string[],
      } = {}
    ) => {
      //console.log(result)

      expect(result.isValid).toBe(expectedValid);

      const actualErrorNames = result.errors.map(e => e.errName).sort();
      const actualSysErrorNames = result.sysErrors.map(s => s.errName).sort();
      const actualWarningNames = result.warnings.map(w => w.errName).sort();

      expect(actualErrorNames).toEqual((names.expectedErrorNames ?? []).sort());
      expect(actualSysErrorNames).toEqual((names.expectedSysErrorNames ?? []).sort());
      expect(actualWarningNames).toEqual((names.expectedWarningNames ?? []).sort());
    };

    // Очищаем idMap перед каждым тестом, чтобы UUID были уникальными для каждого теста
    beforeEach(() => {
      clearUuidMap();
    });

    // --- Тесты, часть 1: Базовая валидация и инициализация ---
    describe('Базовая валидация и инициализация', () => {
      // --- Тест-кейс: Базовая валидная структура ---
      test('должна успешно валидировать базовую валидную структуру', () => {
        // Иерархия: Org1 <- Offer1 -> (Exec1, Exec2)
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 0.5 });
        const executor2 = createExecutor({ key: 'exec2', profitPercentage: 0.5 });
        const offer1 = createOffer({ key: 'offer1', childrenKeys: ['exec1', 'exec2'], fatherKey: 'org1' });
        const org1 = createOrganization({ key: 'org1' });

        const structure = new CooperationStructure(getUuid('offer1'), [
          org1, offer1, executor1, executor2,
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, true);
      });

      // --- Тест-кейс: Валидная структура для команды с вложенным подкомандами ---
      test('должна успешно валидировать структуру с вложенными командами', () => {
        // Иерархия: cmd2 -> (exec3, cmd1 -> (exec1, exec2))
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 0.5 });
        const executor2 = createExecutor({ key: 'exec2', profitPercentage: 0.5 });
        const command1 = createCommand({ key: 'cmd1', childrenKeys: ['exec1', 'exec2'] }); // profit 0.6
        const executor3 = createExecutor({ key: 'exec3', profitPercentage: 0.4 });
        const command2 = createCommand({ key: 'cmd2', childrenKeys: ['exec3', 'cmd1'] });

        const structure = new CooperationStructure(getUuid('cmd2'), [
          command1, executor3, executor1, executor2, command2, // валидность не зависит от очередности массива
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, true);
      });

      // --- Тест-кейс: Не проверяет структуру родителя ---
      test('должна успешно валидировать внутреннюю структуру и не проверять структуру родителя', () => {
        // Иерархия: org1 <- offer1 -> exec1
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 1 });
        const offer1 = createOffer({ key: 'offer1', childrenKeys: ['exec1'], fatherKey: 'org1'});
        const org1 = createOrganization({ key: 'org1', childrenKeys: ['exec3', 'exec2'], fatherKey: 'org2' });

        const structure = new CooperationStructure(getUuid('offer1'), [
          org1, offer1, executor1,
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, true);
      });

      // --- Тест-кейс: Структура с отсутствующим корневым узлом ---
      test('должна выбросить исключение, если корневой узел не найден', () => {
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 1.0 });
        const offer1 = createOffer({ key: 'offer1', childrenKeys: ['exec1'], fatherKey: 'org1' });

        expect(() => new CooperationStructure(getUuid('nonExistentOrg'), [
          offer1, executor1
        ])).toThrow('COOPERATION_STRUCTURE: Root node with ID');
      });
    });

      // --- Тест-кейс: Невалидная структура с родителем родителя организациями ---
      // должно передаваться только родитель корня, все остальные узлы должны относиться к корню
      test('должна выставить ошибку о висячих узлах', () => {
        // Иерархия: Org1 <- Org2 <- Offer1 -> (Exec1, Exec2)
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 0.5 });
        const executor2 = createExecutor({ key: 'exec2', profitPercentage: 0.5 });
        const offer1 = createOffer({ key: 'offer1', childrenKeys: ['exec1', 'exec2'], fatherKey: 'org2' });
        const org2 = createOrganization({ key: 'org2', fatherKey: 'org1' });
        const org1 = createOrganization({ key: 'org1' });

        const structure = new CooperationStructure(getUuid('offer1'), [
          org1, org2, offer1, executor1, executor2,
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, false, {
          expectedErrorNames: ['NotFoundChildrens'],
          expectedSysErrorNames: ['DisconnectedNodes'],
          expectedWarningNames: ['NotHaveNotRequiredFather'],
        }, );
      });

    // --- Тесты, часть 2: Ошибки инициализации и связности ---
    describe('Ошибки инициализации и связности', () => {
      // --- Тест-кейс: Структура с дублирующимися ID агрегатов ---
      test('должна выбросить исключение, если найдены дублирующиеся ID агрегатов', () => {
        const executor1 = createExecutor({ key: 'exec1', title: 'Исполнитель 1', profitPercentage: 1.0 });
        const offer1 = createOffer({ key: 'offer1', childrenKeys: ['exec1'], fatherKey: 'org1' });
        const org1 = createOrganization({ key: 'org1' });

        expect(() => new CooperationStructure(getUuid('org1'), [
          org1, offer1, executor1, executor1
        ])).toThrow('COOPERATION_STRUCTURE: Duplicate aggregate ID found in the provided list:');
      });

      // --- Тест-кейс: Отключенные узлы (не все узлы достижимы от корня) ---
      test('должна сообщать об ошибке DisconnectedNodes для отключенных узлов', () => {
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 0.5 });
        const executor2 = createExecutor({ key: 'exec2', profitPercentage: 0.5 });
        const offer1 = createOffer({ key: 'offer1', childrenKeys: ['exec1', 'exec2'], fatherKey: 'org1' });
        const org1 = createOrganization({ key: 'org1' });

        // Отключенный узел (не связаный с деревом)
        const disconnectedExecutor = createExecutor({ key: 'disconnectedExec', profitPercentage: 1.0 });

        const structure = new CooperationStructure(getUuid('offer1'), [
          org1, offer1, executor1, executor2, disconnectedExecutor,
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, false, {
          expectedSysErrorNames: ['DisconnectedNodes']
        });
        expect(result.sysErrors.some(e =>
                                  e.errName === 'DisconnectedNodes'
                                  && e.nodeId === 'STRUCTURE'
                                  && e.description.includes(getUuid('disconnectedExec')
       ))).toBe(true);
      });

      // --- Тест-кейс: Циклическая зависимость ---
      test('должна сообщать об ошибке циклической зависимости в контейнерах', () => {
        // Сценарий: cmd3 -> (exec4, cmd2 -> (exec3, cmd1 -> (exec1, exec2, cmd3)))
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: .2 });
        const executor2 = createExecutor({ key: 'exec2', profitPercentage: .2 });
        const command1 = createCommand({
          key: 'cmd1',
          childrenKeys: ['exec1', 'exec2', 'cmd3'],
          profitPercentage: 0.5 // цикл на cmd3
        });
        const executor3 = createExecutor({ key: 'exec3', profitPercentage: .5 });
        const command2 = createCommand({ key: 'cmd2', childrenKeys: ['exec3', 'cmd1'], profitPercentage: 0.5 });
        const executor4 = createExecutor({ key: 'exec4', profitPercentage: .5 });
        const command3 = createCommand({ key: 'cmd3', childrenKeys: ['exec4', 'cmd2'] });

        const structure = new CooperationStructure(getUuid('cmd3'), [
          command3, command2, command1, executor4, executor3, executor2, executor1
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, false, {
          expectedErrorNames: ['CyclicDependencyDetected'],
        });
        expect(result.errors.some(e =>
                                  e.errName === 'CyclicDependencyDetected'
                                  && e.nodeId === getUuid('cmd3')
       )).toBe(true);
      });
    });

    describe('У команды всегда должны быть 100% долей в детях', () => {
      // --- Тест-кейс: Недобор процентов ---
      test('должна выдать ошибку несоответствия долей команды', () => {
        // Сценарий: cmd1 -> (exec1, exec2)
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: .4 });
        const executor2 = createExecutor({ key: 'exec2', profitPercentage: .55 });
        const cmd1 = createCommand({ key: 'cmd1', childrenKeys: ['exec1', 'exec2'] });

        const structure = new CooperationStructure(getUuid('cmd1'), [
          executor1, executor2, cmd1
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, false, {
          expectedErrorNames: ['ChildsIsNotFullPersentage']
        });
      });
    });

    describe('проверки на валидность вложенности контейнеров', () => {
      // --- Тест-кейс: У организации желательн указать родителя организацию ---
      test('должна выдать предуперждение об указании родительского узла', () => {
        // Сценарий: org1 -> exec1
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 1 });
        const org1 = createOrganization({ key: 'org1', childrenKeys: ['exec1'] });

        const structure = new CooperationStructure(getUuid('org1'), [
          executor1, org1
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, true, {
          expectedWarningNames: ['NotHaveNotRequiredFather']
        });
      });

      // --- Тест-кейс: В организации родителем может быть только организация ---
      test('должна сообщить об ошибке организации родительского узла', () => {
        // Сценарий: offer1 <- org1 -> exec1
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 1 });
        const organization1 = createOrganization({ key: 'org1', childrenKeys: ['exec1'], fatherKey: 'offer1' });
        const offer1 = createOffer({ key: 'offer1', childrenKeys: ['exec2'], fatherKey: 'org2' });

        const structure = new CooperationStructure(getUuid('org1'), [
          executor1, organization1, offer1
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, false, {
          expectedErrorNames: ['NotSupportedNodeType'],
        });
        expect(result.errors.some(e =>
                                  e.errName === 'NotSupportedNodeType'
                                  && e.nodeId === getUuid('org1')
       )).toBe(true);
      });

      // --- Тест-кейс: В контейнере детьми могут быть только исполнители ---
      test('должна сообщить об ошибке организации родительского узла', () => {
        // Сценарий: offer2 <- org1 -> exec1
        const executor1 = createExecutor({ key: 'exec1', profitPercentage: 1 });
        const org1 = createOrganization({ key: 'org1', childrenKeys: ['exec1'] });
        const org2 = createOrganization({ key: 'org2', childrenKeys: ['exec1', 'org1'] });

        const structure = new CooperationStructure(getUuid('org2'), [
          executor1, org1, org2
        ]);
        const result = structure.getValidationResult();

        expectValidationResult(result, false, {
          expectedErrorNames: ['NotSupportedNodeType'],
          expectedWarningNames: ['NotHaveNotRequiredFather', 'NotHaveNotRequiredFather']
        });
      });
    });
  })
})

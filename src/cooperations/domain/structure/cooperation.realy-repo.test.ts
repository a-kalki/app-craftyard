import { cooperationJsonRepo } from "#cooperations/infra/repo";
import { describe, expect, test } from "bun:test";
import { CooperationStructure } from "./cooperation";
import { CooperationFactory } from "../factory";
import type { Cost } from "#app/core/types";

describe('cooperation.json object tests', () => {
  describe('master offer context', async () => {
    const offerRootNodeId = '04f59841-fc2d-43c8-be08-aec70ce27b2e';
    const treeNodeAttrs = await cooperationJsonRepo.getRootAttrs(offerRootNodeId);
    const factory = new CooperationFactory();
    const treeNodes = factory.batchRestore(treeNodeAttrs);
    const sut = new CooperationStructure(offerRootNodeId, treeNodes);

    test('тестирование дерева распределения для абонементов.', () => {
      const amount: Cost = { price: 25000, currency: 'KZT' };
      sut.distributeProfit(amount);
      const distributeResult = sut.getTreeDistributeResults(amount);
      const expectResult = {
        "04f59841-fc2d-43c8-be08-aec70ce27b2e": {
          flowType: "transit",
          inputValue: {
            currency: "KZT",
            price: 50000,
          },
          title: "Офферы: мастера, ментора",
          type: "OFFER_COOPERATION",
          childs: [
            {
              "36ed0568-1bac-43fc-a9b0-a9f0c55945af": {
                flowType: "profit",
                inputValue: {
                  currency: "KZT",
                  price: 40000, // единственный исполнитель, забирает все денюжки
                },
                title: "Выполнение работы мастера, ментора",
                type: "EXECUTOR",
              },
            }
          ],
          father: {
            "b1cc7792-f61c-4e72-bf8a-0935f179f1fe": {
              flowType: "transit",
              inputValue: {
                currency: "KZT",
                price: 10000, // 20% от предложений
              },
              title: "Организация работы мастерской-бизнеса. Мастера.",
              type: "ORGANIZATION_COOPERATION",
            },
          },
        },
      }
      // @ts-expect-error
      expect(distributeResult).toEqual(expectResult);
    });
  });

  describe('rent offer context', async () => {
    const offerRootNodeId = 'f0e1d2c3-b4a5-6d7e-8f9a-0b1c2d3e4f5a';
    const treeNodeAttrs = await cooperationJsonRepo.getRootAttrs(offerRootNodeId);
    const factory = new CooperationFactory();
    const treeNodes = factory.batchRestore(treeNodeAttrs);
    const sut = new CooperationStructure(offerRootNodeId, treeNodes);

    test('тестирование дерева распределения для абонементов.', () => {
      const amount: Cost = { price: 25000, currency: 'KZT' };
      sut.distributeProfit(amount);
      const distributeResult = sut.getTreeDistributeResults(amount);
      const expectResult = {
        "f0e1d2c3-b4a5-6d7e-8f9a-0b1c2d3e4f5a": {
          title: "Организация работ по абонементам",
          type: "OFFER_COOPERATION",
          inputValue: {
            price: 50000,
            currency: "KZT"
          },
          flowType: "transit",
          childs: [
            {
              "68493d9d-c7ad-400d-a5ba-33dbb699ec8e": {
                title: "Инструктор-цеха, работа с клиентами",
                type: "EXECUTOR",
                inputValue: {
                  price: 17500,
                  currency: "KZT"
                },
                flowType: "profit"
              }
            },
            {
              "0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e": {
                title: "Менеджер по работе с клиентами",
                type: "EXECUTOR",
                inputValue: {
                  price: 17500,
                  currency: "KZT"
                },
                flowType: "profit"
              }
            }
          ],
          father: {
            "f47ac10b-58cc-4372-a567-0e02b2c3d479": {
              title: "Организация работы мастерской-бизнеса. Аренда.",
              type: "ORGANIZATION_COOPERATION",
              inputValue: {
                price: 15000,
                currency: "KZT"
              },
              flowType: "transit"
            }
          }
        }
      }
      // @ts-expect-error
      expect(distributeResult).toEqual(expectResult);
    });
  });

  describe('organization: rent context', async () => {
    const orgRootNodeId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const treeNodeAttrs = await cooperationJsonRepo.getRootAttrs(orgRootNodeId);
    const factory = new CooperationFactory();
    const treeNodes = factory.batchRestore(treeNodeAttrs);
    const sut = new CooperationStructure(orgRootNodeId, treeNodes);

    test('тестирование дерева распределения в организации.', () => {
      const amount: Cost = { price: 5000, currency: 'KZT' };
      const distributeResult = sut.getTreeDistributeResults(amount);
      const expectResult = {
        "f47ac10b-58cc-4372-a567-0e02b2c3d479": {
          title: "Организация работы мастерской-бизнеса. Аренда.",
          type: "ORGANIZATION_COOPERATION",
          inputValue: {
            price: 5000,
            currency: "KZT"
          },
          flowType: "transit",
          childs: [
            {
              "b3a9d7f0-4c12-4e89-9a21-7f8e3c1d2e0a": {
                title: "Общие организационные работы: Абонемент",
                type: "COMMAND_COOPERATION",
                flowType: "transit",
                inputValue: {
                  price: 2500,
                  currency: "KZT"
                },
                childs: [
                  {
                    "e0f1d2c3-a4b5-4c6d-7e8f-9a0b1c2d3e4f": {
                      title: "Обеспечение ресурсами жизнедеятельности",
                      type: "EXECUTOR",
                      inputValue: {
                        price: 1000,
                        currency: "KZT"
                      },
                      flowType: "profit"
                    }
                  },
                  {
                    "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d": {
                      title: "Обеспечение развития мастерской",
                      type: "EXECUTOR",
                      inputValue: {
                        price: 1250,
                        currency: "KZT"
                      },
                      flowType: "profit"
                    }
                  },
                  {
                    "5f6e7d8c-9b0a-1f2e-3d4c-5b6a7f8e9d0c": {
                      title: "Развитие франшиз",
                      type: "EXECUTOR",
                      inputValue: {
                        price: 250,
                        currency: "KZT"
                      },
                      flowType: "profit"
                    }
                  }
                ]
              }
            },
            {
              "d8e7c6b5-2a10-4f93-8b7c-0a1b2c3d4e5f": {
                title: "Выкладка материалов в приложении",
                type: "EXECUTOR",
                inputValue: {
                  price: 2500,
                  currency: "KZT"
                },
                flowType: "profit"
              }
            }
          ]
        }
      }
      // @ts-expect-error
      expect(distributeResult).toEqual(expectResult);
    });
  });
})

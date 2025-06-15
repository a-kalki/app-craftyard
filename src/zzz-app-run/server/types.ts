import type { craftYardServerResolver } from "./resolver"

export type CraftyardServerMeta = {
  name: 'Craftyard Monolith Server',
  description?: 'Запускает мололитное приложение "Ремесленный двор"',
  resolver: typeof craftYardServerResolver
}

import type { craftYardServerResolver } from "./server-resolver"

export type CraftyardServerMeta = {
  name: 'Craftyard Monolith Server',
  description?: 'Запускает мололитное приложение "Ремесленный двор"',
  resolver: typeof craftYardServerResolver
}

import type { dedokServerResolver } from "./resolver"

export type DedokServerMeta = {
  name: 'Dedok Monolith Server',
  description?: 'Запускает мололитное приложение Дедок',
  resolver: typeof dedokServerResolver
}

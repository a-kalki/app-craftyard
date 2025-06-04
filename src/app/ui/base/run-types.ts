/** Модуль хранит типы которые нужны при загрузке приложения для bootstrap.
  Вынесены в отдельный файл, так как зависят от реальных объектов*/

import type { BaseElement } from "./base-element";
import type { Module } from "./module";

export type ModuleManifest = {
  module: Module,
  componentCtors: (typeof BaseElement)[];
}

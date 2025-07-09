/** Абстрактный узел дерева вкладов */
export type CooperationNodeAttrs = {
  id: string,
  title: string, 
  responsibilities: string[],
  type: string,
  editorIds: string[],
}

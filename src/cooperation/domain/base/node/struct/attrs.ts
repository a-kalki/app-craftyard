export type CooperationContextType = 'rent' | 'product-sale' | 'course' | 'hobby-kit';

export type CooperaionContext = {
  type: CooperationContextType,
  title: string,
  descriprion: string,
}
/** Абстрактный узел дерева вкладов */
export type CooperationNodeAttrs = {
  id: string,
  title: string, 
  responsibilities: string[],
  type: string,
  contextType: CooperationContextType[],
}

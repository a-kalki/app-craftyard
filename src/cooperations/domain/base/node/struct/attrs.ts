export type CooperationContextType = 'RENT' | 'PRODUCT_SALE' | 'COURSE' | 'HOBBY_KIT';

export type CooperaionContext = {
  type: CooperationContextType,
  title: string,
  descriprion: string,
}

/** Абстрактный узел дерева вкладов */
export type CooperationNodeAttrs = {
  id: string,
  type: string,
  title: string, 
  contextType: CooperationContextType[],
  organizationId: string,
  responsibilities: string[],
}

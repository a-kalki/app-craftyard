
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';

export type Currency = {
  'KZT': 'Тенге'
};

export type Cost = {
  price: number;
  currency: keyof Currency;
};

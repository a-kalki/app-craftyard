import type { Currency, SkillLevel } from "./types";

export const currency: Currency = {
  KZT: 'Тенге',
}

export const SKILL_LEVEL_TITLES: Record<SkillLevel, string> = {
    BEGINNER: 'Новичок',
    INTERMEDIATE: 'Опытный',
    EXPERT: 'Эксперт',
}

export const SKILL_LEVEL_KEYS: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

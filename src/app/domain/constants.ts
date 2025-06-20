import type { SkillLevel } from "./types";

export const SKILL_LEVEL_TITLES: Record<SkillLevel, string> = {
    BEGINNER: 'Новичок',
    INTERMEDIATE: 'Опытный',
    EXPERT: 'Эксперт',
}

export const SKILL_LEVEL_KEYS: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

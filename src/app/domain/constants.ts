import type { SkillLevel } from "./types";

export const skillLevelTitles: Record<SkillLevel, string> = {
    BEGINNER: 'Новичок',
    INTERMEDIATE: 'Опытный',
    EXPERT: 'Эксперт',
}

export const skillLevelKeys: SkillLevel[] = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

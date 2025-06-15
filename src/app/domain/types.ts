export type CustomContent = {
  title: string; // Заголовок блока
  content: string; // Основное содержимое
  contentType: 'text' | 'html' | 'contacts' | 'list' | 'markdown'; // Тип контента
  order: number; // Порядок отображения
  icon?: string; // Опциональная иконка (например, 'phone', 'info-circle')
};

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';

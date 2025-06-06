import type { UserStatus } from "./dod";

export const USER_STATUS_TITLES: Record<UserStatus, string> = {
  NEWBIE: 'Новичок',
  REACTOR: 'Реагирующий',
  SPEAKER: 'Участник общения',
  BUYER: 'Покупатель',
  MAKER: 'Мастер-любитель',
  SELLER: 'Продавец',
  DESIGNER: 'Конструктор',
  TRAINER: 'Наставник',
  AUTHOR: 'Автор курса',
  KEEPER: 'Хранитель',
  MODERATOR: 'Поддержка',
};

export const USER_STATUS_DESCRIPTIONS: Record<UserStatus, string> = {
  NEWBIE: 'Зарегистрировался в сообществе, но ещё не проявлял активность.',
  REACTOR: 'Оставил хотя бы одну реакцию (лайк, эмодзи) на сообщение в сообществе.',
  SPEAKER: 'Написал хотя бы одно сообщение в сообществе, которое получило реакцию.',
  BUYER: 'Совершил хотя бы одну покупку изделия или мастер-класса через приложение.',
  MAKER: 'Поработал в мастерской в режиме Хобби хотя бы один раз.',
  SELLER: 'Создал и продал хотя бы одно изделие через платформу.',
  DESIGNER: 'Подготовил и загрузил в систему чертёж хотя бы одного изделия.',
  TRAINER: 'Провёл хотя бы один очный мастер-класс.',
  AUTHOR: 'Создал и загрузил в систему полноценную программу мастер-класса или курса.',
  KEEPER: 'Сотрудник мастерской. Отвечает за оборудование, порядок и помощь в мастерской.',
  MODERATOR: 'Имеет расширенный доступ к функциональности приложения. Отвечает за поддержку пользователей.',
};

export const USER_STATUS_ICONS: Record<UserStatus, string> = {
  NEWBIE: 'person',
  REACTOR: 'emoji-smile',
  SPEAKER: 'chat-dots',
  BUYER: 'cart-check',
  MAKER: 'hammer',
  SELLER: 'cash-stack',
  DESIGNER: 'cloud-upload',
  TRAINER: 'person-video',
  AUTHOR: 'journal-code',
  KEEPER: 'tools',
  MODERATOR: 'shield-lock',
};


export const USER_STATUSES: UserStatus[] = Object.keys(USER_STATUS_TITLES) as UserStatus[];

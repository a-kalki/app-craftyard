import type { ContributionDetails, ContributionKey } from "./dod";

export const CONTRIBUTIONS: Record<ContributionKey, ContributionDetails> = {
  REACTOR: {
    title: 'Реагирующий',
    description: 'Активно реагирует на контент сообщества',
    action: 'Оставлять реакции на сообщения',
    icon: 'emoji-smile',
    condition: 'Оставить реакции на сообщения',
    implemented: false,
    trackedBy: 'BOT'
  },
  WRITER: {
    title: 'Писатель',
    description: 'Создаёт развёрнутые сообщения',
    action: 'Писать сообщения длиннее 50 символов',
    icon: 'pencil',
    condition: 'Написать сообщения в чате',
    implemented: false,
    trackedBy: 'BOT'
  },
  SPEAKER: {
    title: 'Коммуникатор',
    description: 'Создаёт контент, вызывающий обсуждения',
    action: 'Писать сообщения, которые получают реакции',
    icon: 'chat-dots',
    condition: 'Получить реакции на свои сообщения',
    implemented: false,
    trackedBy: 'BOT'
  },
  BUYER: {
    title: 'Покупатель',
    description: 'Поддерживает мастеров через покупки',
    action: 'Покупать изделия или мастер-классы',
    icon: 'cart-check',
    condition: 'Совершить покупки',
    implemented: false,
    trackedBy: 'APP'
  },
  MAKER: {
    title: 'Мастер',
    description: 'Создаёт изделия в мастерской',
    action: 'Работать в мастерской',
    icon: 'hammer',
    condition: 'Завершить сессии в мастерской',
    implemented: false,
    trackedBy: 'APP'
  },
  SELLER: {
    title: 'Продавец',
    description: 'Реализует изделия через платформу',
    action: 'Продавать свои работы',
    icon: 'cash-stack',
    condition: 'Завершить продажи',
    implemented: false,
    trackedBy: 'APP'
  },
  DESIGNER: {
    title: 'Конструктор',
    description: 'Создаёт 3D-модели для сообщества',
    action: 'Публиковать модели изделий',
    icon: 'cloud-upload',
    condition: 'Опубликовать модели',
    implemented: false,
    trackedBy: 'APP'
  },
  TRAINER: {
    title: 'Наставник',
    description: 'Проводит обучение для участников',
    action: 'Организовывать мастер-классы',
    icon: 'person-video',
    condition: 'Провести мероприятия',
    implemented: false,
    trackedBy: 'BOTH'
  },
  AUTHOR: {
    title: 'Автор',
    description: 'Создаёт образовательные программы',
    action: 'Разрабатывать курсы',
    icon: 'journal-code',
    condition: 'Опубликовать курсы',
    implemented: false,
    trackedBy: 'APP'
  },
  KEEPER: {
    title: 'Хранитель',
    description: 'Поддерживает работу мастерской',
    action: 'Помогать в организации пространства',
    icon: 'tools',
    condition: 'Быть назначенным',
    implemented: false,
    trackedBy: 'MANUAL'
  },
  MODERATOR: {
    title: 'Модератор',
    description: 'Поддерживает порядок в сообществе',
    action: 'Контролировать соблюдение правил',
    icon: 'shield-lock',
    condition: 'Быть назначенным',
    implemented: false,
    trackedBy: 'MANUAL'
  },
  ORGANIZER: {
    title: 'Организатор',
    description: 'Организует мероприятия',
    action: 'Создавать события для сообщества',
    icon: 'calendar-event',
    condition: 'Организовать мероприятия',
    implemented: false,
    trackedBy: 'BOTH'
  },
  INVESTOR: {
    title: 'Инвестор',
    description: 'Финансово поддерживает развитие',
    action: 'Вкладывать в развитие мастерской',
    icon: 'coin',
    condition: 'Сделать финансовый вклад',
    implemented: false,
    trackedBy: 'APP'
  },
  AMBASSADOR: {
    title: 'Амбассадор',
    description: 'Привлекает новых участников',
    action: 'Рассказывать о сообществе',
    icon: 'megaphone',
    condition: 'Привести новых участников',
    implemented: false,
    trackedBy: 'BOTH'
  },
  REVIEWER: {
    title: 'Эксперт',
    description: 'Даёт профессиональные оценки',
    action: 'Рецензировать работы',
    icon: 'stars',
    condition: 'Оставить экспертные оценки',
    implemented: false,
    trackedBy: 'APP'
  },
  WORKSHOP_CREATOR: {
    title: 'Создатель мастерской',
    description: 'Основатель и владелец мастерской',
    action: 'Создать и развивать мастерскую',
    icon: 'building',
    condition: 'Создать мастерскую',
    implemented: false,
    trackedBy: 'MANUAL'
  },
};

export const CONTRIBUTION_KEYS: ContributionKey[] = Object.keys(CONTRIBUTIONS) as ContributionKey[];

import type { ContributionDetails, ContributionKey, TrackingMethod } from "./types";

export const TRACKING_METHODS: TrackingMethod[] = ['BOT', 'APP', 'MANUAL', 'BOTH'];

export const CONTRIBUTIONS_DETAILS: Record<ContributionKey, ContributionDetails> = {
  NEWBIE: {
    title: 'Новичок',
    description: 'Только что присоединился к сообществу.',
    action: 'Зарегистрировался в системе.',
    icon: 'person',
    condition: 'Зарегистрироваться в системе.',
    implemented: false,
    orderNumber: 0,
    trackedBy: ['BOT', 'APP']
  },
  REACTOR: {
    title: 'Реагирующий',
    description: 'Активно реагирует на контент сообщества',
    action: 'Оставлять реакции на сообщения',
    icon: 'emoji-smile',
    condition: 'Оставить реакции на сообщения',
    implemented: false,
    orderNumber: 1,
    trackedBy: ['BOT']
  },
  WRITER: {
    title: 'Писатель',
    description: 'Создаёт развёрнутые сообщения',
    action: 'Писать сообщения длиннее 50 символов',
    icon: 'pencil',
    condition: 'Написать сообщения в чате',
    implemented: false,
    orderNumber: 2,
    trackedBy: ['BOT']
  },
  SPEAKER: {
    title: 'Коммуникатор',
    description: 'Создаёт контент, вызывающий обсуждения',
    action: 'Писать сообщения, которые получают реакции',
    icon: 'chat-dots',
    condition: 'Получить реакции на свои сообщения',
    implemented: false,
    orderNumber: 3,
    trackedBy: ['BOT']
  },
  BUYER: {
    title: 'Покупатель',
    description: 'Поддерживает мастеров через покупки',
    action: 'Покупать изделия у наших мастеров',
    icon: 'cart-check',
    condition: 'Совершить покупки',
    implemented: false,
    orderNumber: 4,
    trackedBy: ['APP']
  },
  HOBBIST: {
    title: 'Хоббист',
    description: 'Делает изделия для себя',
    action: 'Создавать свои изделия',
    icon: 'wrench',
    condition: 'Сделать в мастерской что нибудь',
    implemented: false,
    orderNumber: 5,
    trackedBy: ['APP']
  },
  MAKER: {
    title: 'Мастер',
    description: 'Создаёт изделия в мастерской',
    action: 'Работать в мастерской',
    icon: 'tools',
    condition: 'Завершить сессии в мастерской',
    implemented: false,
    orderNumber: 6,
    trackedBy: ['APP']
  },
  SELLER: {
    title: 'Продавец',
    description: 'Реализует изделия через платформу',
    action: 'Продавать свои работы',
    icon: 'cash-stack',
    condition: 'Завершить продажи',
    implemented: false,
    orderNumber: 7,
    trackedBy: ['APP']
  },
  DESIGNER: {
    title: 'Конструктор',
    description: 'Создаёт 3D-модели для сообщества',
    action: 'Публиковать модели изделий',
    icon: 'cloud-upload',
    condition: 'Опубликовать модели',
    implemented: false,
    orderNumber: 8,
    trackedBy: ['APP']
  },
  TRAINER: {
    title: 'Наставник',
    description: 'Проводит обучение для участников',
    action: 'Организовывать мастер-классы',
    icon: 'person-video',
    condition: 'Провести мероприятия',
    implemented: false,
    orderNumber: 9,
    trackedBy: ['BOTH']
  },
  AUTHOR: {
    title: 'Автор',
    description: 'Создаёт образовательные программы',
    action: 'Разрабатывать курсы',
    icon: 'journal-code',
    condition: 'Опубликовать курсы',
    implemented: false,
    orderNumber: 10,
    trackedBy: ['APP']
  },
  KEEPER: {
    title: 'Хранитель',
    description: 'Поддерживает работу мастерской',
    action: 'Помогать в организации пространства',
    icon: 'tools',
    condition: 'Быть назначенным',
    implemented: false,
    orderNumber: 11,
    trackedBy: ['MANUAL']
  },
  MODERATOR: {
    title: 'Модератор',
    description: 'Поддерживает порядок в сообществе',
    action: 'Контролировать соблюдение правил',
    icon: 'shield-lock',
    condition: 'Быть назначенным',
    implemented: false,
    orderNumber: 12,
    trackedBy: ['MANUAL']
  },
  ORGANIZER: {
    title: 'Организатор',
    description: 'Организует мероприятия',
    action: 'Создавать события для сообщества',
    icon: 'calendar-event',
    condition: 'Организовать мероприятия',
    implemented: false,
    orderNumber: 13,
    trackedBy: ['BOTH']
  },
  INVESTOR: {
    title: 'Инвестор',
    description: 'Финансово поддерживает развитие',
    action: 'Вкладывать в развитие мастерской',
    icon: 'coin',
    condition: 'Сделать финансовый вклад',
    implemented: false,
    orderNumber: 14,
    trackedBy: ['APP']
  },
  AMBASSADOR: {
    title: 'Амбассадор',
    description: 'Привлекает новых участников',
    action: 'Рассказывать о сообществе',
    icon: 'megaphone',
    condition: 'Привести новых участников',
    implemented: false,
    orderNumber: 15,
    trackedBy: ['BOTH']
  },
  REVIEWER: {
    title: 'Эксперт',
    description: 'Даёт профессиональные оценки',
    action: 'Рецензировать работы',
    icon: 'stars',
    condition: 'Оставить экспертные оценки',
    implemented: false,
    orderNumber: 16,
    trackedBy: ['APP']
  },
  WORKSHOP_CREATOR: {
    title: 'Создатель мастерской',
    description: 'Основатель и владелец мастерской',
    action: 'Создать и развивать мастерскую',
    icon: 'building',
    condition: 'Создать мастерскую',
    implemented: false,
    orderNumber: 17,
    trackedBy: ['MANUAL']
  },
};

export const CONTRIBUTION_KEYS: ContributionKey[] = Object.keys(CONTRIBUTIONS_DETAILS) as ContributionKey[];

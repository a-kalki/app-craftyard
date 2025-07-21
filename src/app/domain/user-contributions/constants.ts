import type { UserContributionDetails, UserContributionKey, TrackingMethod } from "./types";

export const TRACKING_METHODS: TrackingMethod[] = ['BOT', 'APP', 'MANUAL', 'BOTH'];

export const USER_CONTRIBUTIONS_DETAILS: Record<UserContributionKey, UserContributionDetails> = {
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
    condition: 'Сделать в мастерской Изделия для себя',
    implemented: false,
    orderNumber: 5,
    trackedBy: ['APP']
  },
  PROPOSER: {
    title: 'Инициатор',
    description: 'Открывает новые возможности, публикуя предложения.',
    action: 'Создавать и публиковать предложения.',
    icon: 'lightbulb',
    condition: 'Опубликовать предложения.',
    implemented: false,
    orderNumber: 6,
    trackedBy: ['APP']
  },
  EXECUTOR: {
    title: 'Реализатор',
    description: 'Исполняет предложения или заказы.',
    action: 'Реализовывать предложения или выполнять заказы.',
    icon: 'check-circle',
    condition: 'Реализовать предложения/заказы.',
    implemented: false,
    orderNumber: 7,
    trackedBy: ['APP']
  },
  MAKER: {
    title: 'Мастер',
    description: 'Создаёт изделия в мастерской',
    action: 'Работать в мастерской',
    icon: 'tools',
    condition: 'Сделать Изделия для продажи',
    implemented: false,
    orderNumber: 8,
    trackedBy: ['APP']
  },
  SELLER: {
    title: 'Продавец',
    description: 'Реализует Изделия через платформу',
    action: 'Продавать свои работы',
    icon: 'cash-stack',
    condition: 'Завершить продажи',
    implemented: false,
    orderNumber: 9,
    trackedBy: ['APP']
  },
  DESIGNER: {
    title: 'Конструктор',
    description: 'Создаёт 3D-модели для сообщества',
    action: 'Публиковать модели Изделий',
    icon: 'cloud-upload',
    condition: 'Опубликовать модели',
    implemented: false,
    orderNumber: 10,
    trackedBy: ['APP']
  },
  TRAINER: {
    title: 'Наставник',
    description: 'Проводит обучение для участников',
    action: 'Организовывать мастер-классы',
    icon: 'person-video',
    condition: 'Провести курсы или мастер-классы',
    implemented: false,
    orderNumber: 11,
    trackedBy: ['BOTH']
  },
  AUTHOR: {
    title: 'Автор',
    description: 'Создаёт образовательные программы',
    action: 'Разрабатывать курсы',
    icon: 'journal-code',
    condition: 'Опубликовать курсы',
    implemented: false,
    orderNumber: 12,
    trackedBy: ['APP']
  },
  KEEPER: {
    title: 'Хранитель',
    description: 'Поддерживает работу мастерской',
    action: 'Помогать в организации пространства',
    icon: 'tools',
    condition: 'Быть назначенным',
    implemented: false,
    orderNumber: 13,
    trackedBy: ['MANUAL']
  },
  MODERATOR: {
    title: 'Модератор',
    description: 'Поддерживает порядок в сообществе',
    action: 'Контролировать соблюдение правил',
    icon: 'shield-lock',
    condition: 'Быть назначенным',
    implemented: false,
    orderNumber: 14,
    trackedBy: ['MANUAL']
  },
  ORGANIZER: {
    title: 'Организатор',
    description: 'Организует мероприятия',
    action: 'Создавать события для сообщества',
    icon: 'calendar-event',
    condition: 'Организовать мероприятия',
    implemented: false,
    orderNumber: 15,
    trackedBy: ['BOTH']
  },
  INVESTOR: {
    title: 'Инвестор',
    description: 'Финансово поддерживает развитие',
    action: 'Вкладывать в развитие мастерской',
    icon: 'coin',
    condition: 'Сделать финансовый вклад',
    implemented: false,
    orderNumber: 16,
    trackedBy: ['APP']
  },
  AMBASSADOR: {
    title: 'Амбассадор',
    description: 'Привлекает новых участников',
    action: 'Рассказывать о сообществе',
    icon: 'megaphone',
    condition: 'Привести новых участников',
    implemented: false,
    orderNumber: 17,
    trackedBy: ['BOTH']
  },
  REVIEWER: {
    title: 'Эксперт',
    description: 'Даёт профессиональные оценки',
    action: 'Рецензировать работы',
    icon: 'stars',
    condition: 'Оставить экспертные оценки',
    implemented: false,
    orderNumber: 18,
    trackedBy: ['APP']
  },
  CRAFTSMAN: {
    title: 'Мастеровой',
    description: 'Мастерит и открывает мастерскую для других',
    action: 'Создать и развивать мастерскую',
    icon: 'building',
    condition: 'Создать мастерскую',
    implemented: false,
    orderNumber: 19,
    trackedBy: ['APP']
  },
  FOUNDER: {
    title: 'Основатель',
    description: 'Основатель и владелец коворкинг-центра',
    action: 'Создать и развивать коворкинг-центр',
    icon: 'building',
    condition: 'Создать мастерскую',
    implemented: false,
    orderNumber: 20,
    trackedBy: ['APP']
  },
};

export const USER_CONTRIBUTION_KEYS: UserContributionKey[] = Object.keys(USER_CONTRIBUTIONS_DETAILS) as UserContributionKey[];

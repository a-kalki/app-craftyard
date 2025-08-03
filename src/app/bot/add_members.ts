import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import fs from 'fs';
import readline from 'readline';
import { uuidUtility } from 'rilata/api-helper';

// Конфигурация
const API_ID = 26712731;
const API_HASH = '3d8a7b6bc515012866801a59cb51c6d1';
const SESSION_FILE = 'session.txt';
const CHAT_ID = 2375685369; // Числовой ID чата
const USERS_FILE = 'users.json';

// Типы
interface User {
  id: string;
  name: string;
  profile: {
    skillsContentSectionId: string;
    telegramNickname?: string;
    avatarUrl?: string;
  };
  statistics: {
    contributions: {
      NEWBIE: number;
    };
  };
  createAt: number;
  updateAt: number;
}

interface ContentSection {
  id: string;
  ownerId: string;
  ownerName: string;
  access: string;
  context: string;
  title: string;
  order: number;
  icon: string;
  createAt: number;
  updateAt: number;
}

async function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function initClient(): Promise<TelegramClient> {
  let sessionString = '';
  try {
    sessionString = fs.readFileSync(SESSION_FILE, 'utf-8');
  } catch {}

  const client = new TelegramClient(
    new StringSession(sessionString),
    API_ID,
    API_HASH,
    { connectionRetries: 5 }
  );

  await client.start({
    phoneNumber: async () => await askQuestion('Введите номер телефона: '),
    password: async () => await askQuestion('Введите пароль (если есть): '),
    phoneCode: async () => await askQuestion('Введите код из Telegram: '),
    onError: (err) => console.error('Ошибка авторизации:', err),
  });

  fs.writeFileSync(SESSION_FILE, client.session.save() as unknown as string);
  return client;
}

async function getChatParticipants(client: TelegramClient): Promise<Api.User[]> {
  try {
    // Пробуем получить чат как канал/группу
    const chat = await client.getEntity(CHAT_ID);
    if (chat instanceof Api.Channel || chat instanceof Api.Chat) {
      const participants = await client.getParticipants(chat, {
        limit: 200,
      });
      return participants.filter(p => p instanceof Api.User) as Api.User[];
    }
  } catch (e) {
    console.log('Пробуем альтернативный метод получения участников...');
  }

  // Альтернативный метод для личных чатов
  try {
    const dialog = await client.getDialogs({});
    const targetDialog = dialog.find(d => 
      d.entity?.id?.toString() === CHAT_ID.toString() ||
      d.name?.toLowerCase() === 'cc-dedok'
    );
    
    if (targetDialog?.entity) {
      const chat = targetDialog.entity;
      if (chat instanceof Api.Channel || chat instanceof Api.Chat) {
        return await client.getParticipants(chat, { limit: 200 });
      } else if (chat instanceof Api.User) {
        return [chat];
      }
    }
  } catch (e) {
    console.error('Ошибка при альтернативном получении участников:', e);
  }

  throw new Error('Не удалось получить участников чата');
}

async function main() {
  const client = await initClient();

  // Загружаем текущих пользователей
  let existingData: { users?: Record<string, User>, contentSections?: Record<string, ContentSection> } = {};
  try {
    existingData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')) || {};
  } catch (e) {
    console.log('Создаем новый файл users.json');
  }

  try {
    const participants = await getChatParticipants(client);
    const newUsers: Record<string, User> = {};
    const newContentSections: Record<string, ContentSection> = {};
    const now = new Date('2025-05-11T15:20:20Z').getTime();

    for (const participant of participants) {
      const userId = participant.id.toString();
      if (existingData.users?.[userId]) continue;

      const sectionId = uuidUtility.getNewUuidV4();
      
      // Используем first_name для name и username для telegramNickname
      const name = participant.firstName || `User_${userId}`;
      const telegramNickname = participant.username;

      newUsers[userId] = {
        id: userId,
        name: name, // Имя для обращения (first_name)
        profile: {
          skillsContentSectionId: sectionId,
          telegramNickname: telegramNickname, // Псевдоним (@username)
          avatarUrl: participant.photo 
            ? `https://t.me/i/userpic/320/${participant.photo.originalArgs?.dcId || 0}/${participant.photo.originalArgs?.photoId}.jpg` 
            : undefined
        },
        statistics: {
          contributions: { NEWBIE: 1 }
        },
        createAt: now,
        updateAt: now
      };

      newContentSections[sectionId] = {
        id: sectionId,
        ownerId: 'UserAr',
        ownerName: name, // Используем name (first_name) для отображения
        access: 'public',
        context: 'user-info',
        title: 'Навыки',
        order: 1,
        icon: 'brilliance',
        createAt: now,
        updateAt: now
      };
    }

    // Сохраняем результат
    const result = {
      users: { ...existingData.users, ...newUsers },
      contentSections: { ...existingData.contentSections, ...newContentSections },
      _meta: {
        updatedAt: new Date().toISOString(),
        newUsersCount: Object.keys(newUsers).length
      }
    };

    fs.writeFileSync(USERS_FILE, JSON.stringify(result, null, 2));
    console.log(`Добавлено ${Object.keys(newUsers).length} новых пользователей`);

  } catch (e) {
    console.error('Ошибка:', e);
  } finally {
    await client.disconnect();
  }
}

main().catch(console.error);

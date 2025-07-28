// main.ts
import { Telegraf } from 'telegraf';
import { MTProto } from 'telegram-mtproto';
import fs from 'fs';
import readline from 'readline';


const APP_BOT_TOKEN = '8021888139:AAFNATZTZZYhboByY5LmlHxB3RzHFJ1XRh0';

const MEMBERS_BOT_TOKEN='7709770349:AAFMwQCA5f1IKFzaD7SwMf9TVmhRS_XAvcM';

const MEMBERS_BOT_NAME='dedok_members_bot'

const DEDOK_GROUP_ID='-1002375685369'

const DEDOK_GROUP_NAME='cc-Dedok'

const DEDOK_ACTIONS_TOPIC_ID=17

const API_ID = '26712731';

const API_HASH = '3d8a7b6bc515012866801a59cb51c6d1';

const PHONE_NUMBER = '-++77772878182';

const api = {
  layer: 57,
  initConnection: 0x69796de9,
  api_id: parseInt(API_ID!),
  api_hash: API_HASH!
};

const phone = {
  num: PHONE_NUMBER!,
  code: ''
};

const client = MTProto({
  server: {
    dev: false
  },
  api
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function auth() {
  try {
    // 1. Запрашиваем код
    const { phone_code_hash } = await client('auth.sendCode', {
      phone_number: phone.num,
      current_number: false,
      api_id: api.api_id,
      api_hash: api.api_hash
    });

    // 2. Получаем код от пользователя
    phone.code = await new Promise<string>(resolve => {
      rl.question('Введите код из SMS: ', resolve);
    });

    // 3. Авторизуемся
    await client('auth.signIn', {
      phone_number: phone.num,
      phone_code_hash,
      phone_code: phone.code
    });

    console.log('Авторизация успешна!');
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw error;
  }
}

async function getChatHistory() {
  try {
    // 1. Ищем чат
    const resolved = await client('contacts.resolveUsername', {
      username: 'cc-Dedok' // или 'cc-Dedok'
    });

    if (!resolved.chats || resolved.chats.length === 0) {
      throw new Error('Чат не найден');
    }

    const chat = resolved.chats[0];
    console.log(`Найден чат: ${chat.title}`);

    // 2. Получаем историю сообщений
    let allMessages: any[] = [];
    let offsetId = 0;

    while (true) {
      const history = await client('messages.getHistory', {
        peer: {
          _: 'inputPeerChannel',
          channel_id: chat.id,
          access_hash: chat.access_hash
        },
        limit: 100,
        offset_id: offsetId,
        add_offset: 0
      });

      if (!history.messages || history.messages.length === 0) break;

      allMessages = [...allMessages, ...history.messages];
      offsetId = history.messages[history.messages.length - 1].id;
      
      console.log(`Загружено ${allMessages.length} сообщений...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Сохраняем результат
    fs.writeFileSync('dedok_chat.json', JSON.stringify({
      chatInfo: {
        id: chat.id,
        title: chat.title,
        username: chat.username
      },
      messages: allMessages
    }, null, 2));

    console.log(`Сохранено ${allMessages.length} сообщений в dedok_chat.json`);

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    rl.close();
    process.exit();
  }
}

(async () => {
  await auth();
  await getChatHistory();
})();

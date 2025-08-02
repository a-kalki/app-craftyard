import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import fs from 'fs';
import readline from 'readline';

const API_ID = 26712731;
const API_HASH = '3d8a7b6bc515012866801a59cb51c6d1';
const PHONE_NUMBER = '+77772878182';

const stringSession = new StringSession(''); // Можно сохранить сессию для повторного использования

const client = new TelegramClient(
  stringSession,
  API_ID,
  API_HASH,
  { connectionRetries: 5 }
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function auth() {
  await client.start({
    phoneNumber: PHONE_NUMBER,
    phoneCode: async () => {
      return new Promise(resolve => {
        rl.question('Введите код из SMS: ', resolve);
      });
    },
    onError: err => console.log('Ошибка авторизации:', err)
  });
  console.log('Авторизация успешна!');
  console.log('Session:', client.session.save()); // Сохраняем сессию
}

async function listDialogs() {
  try {
    const dialogs = await client.getDialogs({});
    console.log('\nДоступные чаты:');
    dialogs.forEach((dialog, index) => {
      const chat = dialog.entity;
      console.log(`${index + 1}. ${chat.title || chat.firstName} (ID: ${chat.id})`);
    });

    return dialogs;
  } catch (error) {
    console.error('Ошибка при получении списка чатов:', error);
    throw error;
  }
}

async function getChatHistory(chatId: number) {
  try {
    // Получаем информацию о чате
    const chat = await client.getEntity(chatId);
    console.log(`\nВыбран чат: ${chat.title}`);

    // Собираем все сообщения
    let allMessages: any[] = [];
    let offsetId = 0;

    while (true) {
      const messages = await client.getMessages(chat, {
        limit: 100,
        offsetId
      });

      if (messages.length === 0) break;

      allMessages = [...allMessages, ...messages];
      offsetId = messages[messages.length - 1].id;
      
      console.log(`Загружено ${allMessages.length} сообщений...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Сохраняем результат
    const filename = `chat_${chat.id}_history.json`;
    fs.writeFileSync(filename, JSON.stringify({
      chatInfo: {
        id: chat.id,
        title: chat.title,
        username: chat.username
      },
      messages: allMessages.map(m => ({
        id: m.id,
        text: m.text,
        date: m.date,
        fromId: m.fromId
      }))
    }, null, 2));

    console.log(`\nСохранено ${allMessages.length} сообщений в ${filename}`);

  } catch (error) {
    console.error('Ошибка:', error);
  }
}

(async () => {
  try {
    await auth();
    const dialogs = await listDialogs();
    
    const answer = await new Promise<string>(resolve => {
      rl.question('\nВведите номер чата для загрузки истории (или 0 для выхода): ', resolve);
    });
    
    const selectedIndex = parseInt(answer) - 1;
    
    if (selectedIndex >= 0 && selectedIndex < dialogs.length) {
      const selectedChat = dialogs[selectedIndex].entity;
      await getChatHistory(selectedChat.id);
    } else {
      console.log('Выход...');
    }
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    rl.close();
    await client.disconnect();
  }
})();

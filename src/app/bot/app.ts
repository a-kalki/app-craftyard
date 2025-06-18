import { Telegraf } from 'telegraf';
import https from 'node:https';

const BOT_TOKEN = '8021888139:AAFNATZTZZYhboByY5LmlHxB3RzHFJ1XRh0';
const WEB_APP_URL = 'https://a429-2a0d-b201-6020-b7ec-1d86-6638-960c-3e4c.ngrok-free.app';

export const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply('Запустить приложение:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть',
            web_app: { url: WEB_APP_URL },
          },
        ],
      ],
    },
  });
});

function checkTelegramAPI(token: string): Promise<boolean> {
  return new Promise((resolve) => {
    https.get(`https://api.telegram.org/bot${token}/getMe`, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

checkTelegramAPI(BOT_TOKEN).then((available) => {
  if (available) {
    bot.launch().then(() => {
      console.log('bot launched...');
    });
  } else {
    console.error('Telegram API недоступен. Бот не запущен.');
  }
});

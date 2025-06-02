import { Telegraf } from 'telegraf';

// const botToken = process.env.BOT_TOKEN!;
const botToken = '8021888139:AAFNATZTZZYhboByY5LmlHxB3RzHFJ1XRh0';
const webAppUrl = 'https://6427-2a0d-b201-6010-f366-2288-5815-6dde-5483.ngrok-free.app';

export const bot = new Telegraf(botToken);

bot.start((ctx) => {
  return ctx.reply('Запустить приложение:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть',
            web_app: { url: webAppUrl },
          },
        ],
      ],
    },
  });
});

bot.launch();

console.log('bot launched...');

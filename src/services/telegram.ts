import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';

export const bot = new TelegramBot(config.TELEGRAM_TOKEN, { polling: false });

export function sendMessage(text: string) {
  return bot.sendMessage(config.TELEGRAM_CHAT_ID, text, { parse_mode: 'Markdown' });
}

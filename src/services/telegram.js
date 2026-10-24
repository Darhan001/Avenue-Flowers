import { config, isTelegramConfigured } from '../config.js';

const TELEGRAM_TIMEOUT_MS = 10_000;

export async function sendTelegramMessage(text) {
  if (!isTelegramConfigured) {
    throw new Error('Telegram не настроен: задайте TG_TOKEN и TG_CHAT_ID');
  }

  const res = await fetch(`https://api.telegram.org/bot${config.telegram.token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: config.telegram.chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(`Telegram ответил ${res.status}: ${data.description ?? 'без описания'}`);
  }
}

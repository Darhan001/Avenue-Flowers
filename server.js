import { config, isTelegramConfigured } from './src/config.js';
import { createApp } from './src/app.js';

if (!isTelegramConfigured) {
  console.warn('⚠ TG_TOKEN / TG_CHAT_ID не заданы: заявки не будут отправляться в Telegram.');
}

createApp().listen(config.port, () => {
  console.log(`Avenue Flowers запущен: http://localhost:${config.port}`);
});

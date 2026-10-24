import 'dotenv/config';

// Все настройки читаются из переменных окружения (см. .env.example).
const port = Number(process.env.PORT) || 3000;

export const config = {
  port,
  siteUrl: (process.env.SITE_URL || `http://localhost:${port}`).replace(/\/$/, ''),
  // Код подтверждения сайта из Google Search Console (метатег google-site-verification).
  googleSiteVerification: (process.env.GOOGLE_SITE_VERIFICATION || '').trim(),
  // Число прокси перед приложением (на Render — 1). Нужно, чтобы видеть настоящий IP клиента.
  trustProxy: Number(process.env.TRUST_PROXY ?? 1),
  telegram: {
    token: process.env.TG_TOKEN || '',
    chatId: process.env.TG_CHAT_ID || '',
  },
  orderRateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 10,
  },
};

export const isTelegramConfigured = Boolean(config.telegram.token && config.telegram.chatId);

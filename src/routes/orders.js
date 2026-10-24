import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { validateOrder } from '../validation/order.js';
import { buildOrderMessage } from '../services/orderMessage.js';
import { sendTelegramMessage } from '../services/telegram.js';

export const ordersRouter = Router();

const orderLimiter = rateLimit({
  windowMs: config.orderRateLimit.windowMs,
  limit: config.orderRateLimit.max,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Слишком много заявок. Попробуйте позже.' },
});

ordersRouter.post('/', orderLimiter, async (req, res) => {
  // Поле-ловушка заполняют только боты: отвечаем как при успехе, но заявку не отправляем.
  if (req.body?.website) {
    return res.status(201).json({ ok: true });
  }

  const { value, errors } = validateOrder(req.body);
  if (errors) {
    return res.status(400).json({ error: 'Проверьте заполнение формы', fields: errors });
  }

  try {
    await sendTelegramMessage(buildOrderMessage(value));
  } catch (err) {
    console.error('Не удалось отправить заявку в Telegram:', err.message);
    return res.status(502).json({ error: 'Не удалось отправить заявку, попробуйте позже' });
  }

  res.status(201).json({ ok: true });
});

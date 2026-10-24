import { paymentMethods } from '../../public/js/data/payments.js';
import { formatAddress, formatPrice } from '../../public/js/utils/format.js';

const TIME_ZONE = 'Asia/Bishkek';

// Telegram с parse_mode=HTML требует экранирования пользовательского ввода.
const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildOrderMessage(order) {
  const pm = paymentMethods.find((x) => x.id === order.payment);
  const now = new Date().toLocaleString('ru-RU', { timeZone: TIME_ZONE });

  const lines = [
    '🌸 <b>Новая заявка — Avenue Flowers</b>',
    '',
    `👤 <b>Имя:</b> ${escapeHtml(order.name)}`,
    `📞 <b>Телефон:</b> ${escapeHtml(order.phone)}`,
  ];

  if (order.category) {
    lines.push(`💐 <b>Категория:</b> ${escapeHtml(order.category)}`);
  }

  if (order.items.length) {
    const itemLines = order.items.map(
      (item) =>
        `  • ${escapeHtml(item.name)} × ${item.qty} = ${formatPrice(item.price * item.qty)}`,
    );
    const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    lines.push('🛒 <b>Из корзины:</b>', ...itemLines, `💰 <b>Итого:</b> ${formatPrice(total)}`);
  }

  lines.push(
    `📅 <b>Доставка:</b> ${escapeHtml(order.date)} · ${escapeHtml(order.time)}`,
    `🏠 <b>Адрес:</b> ${escapeHtml(formatAddress(order.address))}`,
    `${pm.icon} <b>Оплата:</b> ${escapeHtml(pm.name)}${pm.number ? `\n💳 <b>Реквизиты:</b> ${escapeHtml(pm.number)}` : ''}`,
  );

  if (order.comment) {
    lines.push(`💬 <b>Комментарий:</b> ${escapeHtml(order.comment)}`);
  }

  lines.push('', `⏰ ${now}`);
  return lines.join('\n');
}

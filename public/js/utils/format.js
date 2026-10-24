// Чистые функции форматирования. Без работы с DOM, поэтому используются и на сервере.

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

export const formatPrice = (value) => `${value.toLocaleString('ru-RU')} сом`;

export function formatAddress({ street, house, apt, floor, landmark }) {
  return [
    street,
    house,
    apt && `кв/офис ${apt}`,
    floor && `этаж ${floor}`,
    landmark && `(${landmark})`,
  ]
    .filter(Boolean)
    .join(', ');
}

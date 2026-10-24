import { products } from '../../public/js/data/products.js';
import { paymentMethods } from '../../public/js/data/payments.js';
import { orderCategories, deliverySlots } from '../../public/js/data/orderOptions.js';

const PHONE_RE = /^\+?\d[\d\s()-]{7,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_ITEM_QTY = 50;
const MAX_ITEMS = 50;

const text = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

// Сегодняшняя дата по часовому поясу магазина (YYYY-MM-DD).
const todayInShopZone = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bishkek' }).format(new Date());

// Возвращает очищенные данные заказа и объект ошибок по полям (или null, если всё верно).
// Цены берутся из каталога на сервере, а не из запроса клиента.
export function validateOrder(body = {}) {
  const errors = {};

  const items = (Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [])
    .map((raw) => {
      const product = products.find((p) => p.id === Number(raw?.id));
      const qty = Number.isInteger(raw?.qty) ? raw.qty : 0;
      if (!product || qty < 1 || qty > MAX_ITEM_QTY) return null;
      return { id: product.id, name: product.name, price: product.price, qty };
    })
    .filter(Boolean);

  const order = {
    name: text(body.name, 100),
    phone: text(body.phone, 30),
    category: text(body.category, 100),
    date: text(body.date, 10),
    time: text(body.time, 30),
    payment: text(body.payment, 30),
    comment: text(body.comment, 1000),
    address: {
      street: text(body.address?.street, 150),
      house: text(body.address?.house, 20),
      apt: text(body.address?.apt, 20),
      floor: text(body.address?.floor, 10),
      landmark: text(body.address?.landmark, 150),
    },
    items,
  };

  if (order.name.length < 2) errors.name = 'Укажите имя';
  if (!PHONE_RE.test(order.phone)) errors.phone = 'Введите телефон, например +996 501 21 01 23';

  if (order.category && !orderCategories.includes(order.category)) {
    errors.category = 'Некорректная категория';
  } else if (!order.category && items.length === 0) {
    errors.category = 'Выберите категорию или добавьте букеты в корзину';
  }

  if (!DATE_RE.test(order.date) || order.date < todayInShopZone()) {
    errors.date = 'Выберите сегодняшнюю или будущую дату';
  }
  if (!deliverySlots.includes(order.time)) errors.time = 'Выберите время доставки';

  if (!paymentMethods.some((pm) => pm.id === order.payment)) {
    errors.payment = 'Выберите способ оплаты';
  }

  if (order.address.street.length < 2) errors.street = 'Укажите улицу';
  if (!order.address.house) errors.house = 'Укажите номер дома';

  return Object.keys(errors).length ? { value: null, errors } : { value: order, errors: null };
}

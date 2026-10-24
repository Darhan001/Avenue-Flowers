// Форма заявки: заполнение опций, отправка на сервер, итоговое окно.
import { paymentMethods } from '../data/payments.js';
import { orderCategories, deliverySlots } from '../data/orderOptions.js';
import { getCart, clearCart } from '../state/cart.js';
import { $ } from '../utils/dom.js';
import { escapeHtml, formatAddress, formatPrice } from '../utils/format.js';
import { getSelectedPayment, renderPaymentSelector } from './payments.js';
import { showToast, showOrderModal } from './feedback.js';

const fill = (select, options) => {
  select.insertAdjacentHTML(
    'beforeend',
    options.map((o) => `<option>${escapeHtml(o)}</option>`).join(''),
  );
};

function collectOrder() {
  const val = (id) => $(`#${id}`).value;
  return {
    name: val('fieldName'),
    phone: val('fieldPhone'),
    category: val('fieldCategory'),
    date: val('fieldDate'),
    time: val('fieldTime'),
    address: {
      street: val('fieldStreet'),
      house: val('fieldHouse'),
      apt: val('fieldApt'),
      floor: val('fieldFloor'),
      landmark: val('fieldLandmark'),
    },
    payment: getSelectedPayment(),
    comment: val('fieldComment'),
    items: getCart().map(({ id, qty }) => ({ id, qty })),
    website: val('fieldWebsite'),
  };
}

function summaryRows(order) {
  const pm = paymentMethods.find((x) => x.id === order.payment);
  const cart = getCart();
  const total = cart.reduce((sum, x) => sum + x.price * x.qty, 0);

  const rows = [
    ['Имя', escapeHtml(order.name)],
    ['Телефон', escapeHtml(order.phone)],
  ];
  if (order.category) rows.push(['Категория', escapeHtml(order.category)]);
  if (cart.length) rows.push(['Букеты', `${cart.length} поз. · ${formatPrice(total)}`]);
  rows.push(
    ['Доставка', `${escapeHtml(order.date)} · ${escapeHtml(order.time)}`],
    ['Адрес', escapeHtml(formatAddress(order.address))],
    ['Оплата', `${pm.icon} ${escapeHtml(pm.name)}`],
  );
  if (pm.number) rows.push(['Реквизиты', escapeHtml(pm.number)]);
  return rows;
}

async function submit(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.reportValidity()) return;

  const order = collectOrder();
  const btn = form.querySelector('button[type=submit]');
  const label = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const firstField = data.fields && Object.values(data.fields)[0];
      showToast('Заявка не отправлена', firstField || data.error || 'Попробуйте ещё раз', {
        isError: true,
      });
      return;
    }

    showOrderModal(summaryRows(order));
    form.reset();
    if (order.items.length) clearCart();
    renderPaymentSelector();
  } catch {
    showToast('Нет связи с сервером', 'Проверьте интернет и попробуйте ещё раз', { isError: true });
  } finally {
    btn.disabled = false;
    btn.innerHTML = label;
  }
}

export function initOrderForm() {
  fill($('#fieldCategory'), orderCategories);
  fill($('#fieldTime'), deliverySlots);

  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  $('#fieldDate').min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  $('#orderForm').addEventListener('submit', submit);
}

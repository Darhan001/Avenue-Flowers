// Способы оплаты: карточки в информационном блоке и выбор способа в форме заказа.
import { paymentMethods } from '../data/payments.js';
import { $ } from '../utils/dom.js';
import { escapeHtml } from '../utils/format.js';

let selectedId = paymentMethods[0].id;

export const getSelectedPayment = () => selectedId;

export function renderPaymentInfo() {
  $('#paymentGrid').innerHTML = paymentMethods
    .map((pm) => {
      const badge = pm.badge ? `<span class="pm-badge">${escapeHtml(pm.badge)}</span>` : '';
      const number = pm.number
        ? `<br><strong style="color:${pm.color}">${escapeHtml(pm.number)}</strong>`
        : '';
      return `
        <div class="payment-method-card">
          ${badge}
          <div class="pm-logo" style="background:${pm.bgColor}; color:${pm.color};">${pm.icon}</div>
          <div class="pm-name">${escapeHtml(pm.name)}</div>
          <div class="pm-desc">${escapeHtml(pm.desc)}${number}</div>
        </div>`;
    })
    .join('');
}

export function renderPaymentSelector() {
  $('#paymentSelector').innerHTML = paymentMethods
    .map(
      (pm) => `
      <button type="button" class="pay-btn ${pm.id === selectedId ? 'selected' : ''}" data-pay-id="${pm.id}" aria-label="${escapeHtml(pm.name)}">
        <span class="pay-icon">${pm.icon}</span>
        <span class="pay-label">${escapeHtml(pm.name)}</span>
      </button>`,
    )
    .join('');
}

export function initPaymentSelector() {
  $('#paymentSelector').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pay-id]');
    if (!btn) return;
    selectedId = btn.dataset.payId;
    renderPaymentSelector();
  });
}

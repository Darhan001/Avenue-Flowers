// Всплывающее уведомление (toast) и модальное окно подтверждения заявки.
import { $ } from '../utils/dom.js';
import { escapeHtml } from '../utils/format.js';

let toastTimer;

export function showToast(title, text, { isError = false } = {}) {
  const el = $('#notification');
  $('#notifTitle').textContent = title;
  $('#notifText').textContent = text;
  el.classList.toggle('is-error', isError);
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// rows: массив пар [подпись, значение]
export function showOrderModal(rows) {
  const summary = $('#modalSummary');
  summary.innerHTML = rows
    .map(([label, value]) => `<div><strong>${escapeHtml(label)}:</strong> ${value}</div>`)
    .join('');
  $('#orderModal').classList.add('show');
}

export function initModal() {
  const close = () => $('#orderModal').classList.remove('show');
  $('#orderModal').addEventListener('click', (e) => {
    if (e.target.id === 'orderModal' || e.target.closest('[data-action="close-modal"]')) close();
  });
}

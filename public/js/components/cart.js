// Боковая корзина: список товаров, количество, удаление, переход к оформлению.
import { getCart, getCartTotals, changeQty, removeFromCart } from '../state/cart.js';
import { $ } from '../utils/dom.js';
import { escapeHtml, formatPrice } from '../utils/format.js';
import { showToast } from './feedback.js';

function renderItems() {
  const wrap = $('#cartItems');
  const items = getCart();

  if (items.length === 0) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Корзина пуста</p>
      </div>`;
    return;
  }

  wrap.innerHTML = items
    .map(
      (item) => `
      <div class="cart-item">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
        <div class="cart-item-info">
          <h5>${escapeHtml(item.name)}</h5>
          <p>${formatPrice(item.price)}</p>
          <div class="qty-controls">
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-delta="-1">−</button>
            <span class="qty-val">${item.qty}</span>
            <button type="button" class="qty-btn" data-qty-id="${item.id}" data-delta="1">+</button>
          </div>
        </div>
        <button type="button" class="remove-item" data-remove-id="${item.id}" aria-label="Удалить">
          <i class="fas fa-trash"></i>
        </button>
      </div>`,
    )
    .join('');
}

function render() {
  const { count, total } = getCartTotals();
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = formatPrice(total);
  renderItems();
}

export function toggleCart(force) {
  $('#cartSidebar').classList.toggle('open', force);
  $('#cartOverlay').classList.toggle('show', force);
}

// Корзина уходит вместе с формой: контакты и адрес клиент заполняет в форме заказа.
function checkout() {
  if (getCart().length === 0) return;
  toggleCart(false);
  $('#contact').scrollIntoView({ behavior: 'smooth' });
  $('#fieldName').focus({ preventScroll: true });
  showToast('Почти готово', 'Заполните форму — корзина отправится вместе с заявкой');
}

export function initCart() {
  window.addEventListener('cart:change', render);
  render();

  $('#cartItems').addEventListener('click', (e) => {
    const qty = e.target.closest('[data-qty-id]');
    if (qty) return changeQty(Number(qty.dataset.qtyId), Number(qty.dataset.delta));
    const remove = e.target.closest('[data-remove-id]');
    if (remove) removeFromCart(Number(remove.dataset.removeId));
  });

  document.querySelectorAll('[data-action="toggle-cart"]').forEach((el) =>
    el.addEventListener('click', () => toggleCart()),
  );
  $('[data-action="checkout"]').addEventListener('click', checkout);
}

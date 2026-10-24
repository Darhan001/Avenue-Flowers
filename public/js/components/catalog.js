// Каталог букетов: карточки, добавление в корзину, открытие лайтбокса.
import { products } from '../data/products.js';
import { addToCart } from '../state/cart.js';
import { $ } from '../utils/dom.js';
import { escapeHtml, formatPrice } from '../utils/format.js';
import { openLightbox } from './lightbox.js';
import { showToast } from './feedback.js';

function productCard(product, index) {
  const badge = product.badge
    ? `<span class="product-badge">${escapeHtml(product.badge)}</span>`
    : '';
  const oldPrice = product.oldPrice
    ? `<span>${formatPrice(product.oldPrice)}</span>`
    : '';

  return `
    <div class="product-card reveal">
      <div class="product-img" data-open-lightbox="${index}">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
        ${badge}
      </div>
      <div class="product-info">
        <h4>${escapeHtml(product.name)}</h4>
        <p>${escapeHtml(product.desc)}</p>
        <div class="product-price">
          <div class="price">
            ${formatPrice(product.price)}
            ${oldPrice}
          </div>
          <button type="button" class="add-to-cart" data-add-id="${product.id}" aria-label="В корзину">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>`;
}

export function initCatalog() {
  const grid = $('#productsGrid');
  grid.innerHTML = products.map(productCard).join('');

  grid.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-id]');
    if (addBtn) {
      const product = products.find((p) => p.id === Number(addBtn.dataset.addId));
      addToCart(product);
      showToast('Добавлено в корзину!', `"${product.name}" добавлен`);
      return;
    }
    const imgWrap = e.target.closest('[data-open-lightbox]');
    if (imgWrap) openLightbox(Number(imgWrap.dataset.openLightbox));
  });
}

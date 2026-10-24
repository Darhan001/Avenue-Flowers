// Лайтбокс: просмотр букета на весь экран с навигацией стрелками и клавиатурой.
import { products } from '../data/products.js';
import { addToCart } from '../state/cart.js';
import { $ } from '../utils/dom.js';
import { formatPrice } from '../utils/format.js';
import { showToast } from './feedback.js';

let currentIndex = 0;

function render() {
  const p = products[currentIndex];
  const img = $('#lbImg');
  img.style.opacity = '0';
  img.onload = () => {
    img.style.transition = 'opacity .3s';
    img.style.opacity = '1';
  };
  img.src = p.image;
  img.alt = p.name;
  $('#lbName').textContent = p.name;
  $('#lbDesc').textContent = p.desc;
  $('#lbPrice').textContent = formatPrice(p.price);
  $('#lbOldPrice').textContent = p.oldPrice ? formatPrice(p.oldPrice) : '';
  $('#lbAddBtn').dataset.id = p.id;
}

function isOpen() {
  return $('#lightbox').classList.contains('open');
}

export function openLightbox(index) {
  currentIndex = index;
  render();
  $('#lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeLightbox() {
  $('#lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function navigate(delta) {
  currentIndex = (currentIndex + delta + products.length) % products.length;
  render();
}

export function initLightbox() {
  const lb = $('#lightbox');

  lb.addEventListener('click', (e) => {
    if (e.target === lb) return closeLightbox();
    const action = e.target.closest('[data-lb-action]')?.dataset.lbAction;
    if (action === 'close') closeLightbox();
    if (action === 'prev') navigate(-1);
    if (action === 'next') navigate(1);
    if (action === 'add') {
      const product = products.find((p) => p.id === Number($('#lbAddBtn').dataset.id));
      addToCart(product);
      showToast('Добавлено в корзину!', `"${product.name}" добавлен`);
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

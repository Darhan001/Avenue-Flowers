// Слайдер отзывов с автопрокруткой и точками навигации.
import { $, $$ } from '../utils/dom.js';

const INTERVAL_MS = 5000;

export function initTestimonials() {
  const slider = $('.testi-slider');
  const items = $$('.testi-item', slider);
  const dots = $$('.dot', slider);
  let current = 0;
  let timer;

  function show(index) {
    items.forEach((el, i) => el.classList.toggle('active', i === index));
    dots.forEach((el, i) => el.classList.toggle('active', i === index));
    current = index;
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => show((current + 1) % items.length), INTERVAL_MS);
  }

  dots.forEach((dot, i) =>
    dot.addEventListener('click', () => {
      show(i);
      restartAutoplay();
    }),
  );

  restartAutoplay();
}

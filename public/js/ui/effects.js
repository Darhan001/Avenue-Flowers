// Визуальные эффекты: прелоадер, падающие лепестки, появление блоков при прокрутке.
import { $, $$ } from '../utils/dom.js';

const PETALS_COUNT = 14;
const PETALS_MOBILE_COUNT = 6;
const PRELOADER_HIDE_DELAY_MS = 1600;

export function initPreloader() {
  const logo = $('#preloaderLogo');
  [...'🌸 Avenue Flowers'].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'jump-letter';
    span.textContent = ch === ' ' ? ' ' : ch;
    span.style.animationDelay = `${i * 0.08}s`;
    logo.appendChild(span);
  });

  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader').classList.add('hidden'), PRELOADER_HIDE_DELAY_MS);
  });
}

export function initPetals() {
  const wrap = $('#petals-container');
  const count = matchMedia('(max-width: 768px)').matches ? PETALS_MOBILE_COUNT : PETALS_COUNT;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = Math.random() * 10 + 9;
    petal.style.cssText = `
      left:${Math.random() * 100}vw;
      width:${size}px; height:${size}px;
      animation-duration:${Math.random() * 5 + 6}s;
      animation-delay:${Math.random() * 6}s;
    `;
    wrap.appendChild(petal);
  }
}

// Блоки с классом .reveal плавно появляются, когда попадают во viewport.
export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -90px 0px' },
  );
  $$('.reveal').forEach((el) => observer.observe(el));
}

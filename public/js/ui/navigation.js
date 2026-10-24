// Навигация: эффект шапки при прокрутке, мобильное меню.
import { $, $$ } from '../utils/dom.js';

function setMobileNav(open) {
  $('#mobileNav').classList.toggle('open', open);
  $('#burgerBtn').classList.toggle('open', open);
  $('#mobileNavOverlay').classList.toggle('show', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

export function initNavigation() {
  const navbar = $('#navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $('#burgerBtn').addEventListener('click', () => {
    setMobileNav(!$('#mobileNav').classList.contains('open'));
  });
  $('#mobileNavOverlay').addEventListener('click', () => setMobileNav(false));
  $$('[data-close-mobile-nav]').forEach((link) =>
    link.addEventListener('click', () => setMobileNav(false)),
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMobileNav(false);
  });
}

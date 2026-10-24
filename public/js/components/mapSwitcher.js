// Переключатель карт магазинов: вкладки с адресами и ссылка «Открыть в Google Maps».
import { $, $$ } from '../utils/dom.js';

export function initMapSwitcher() {
  const tabs = $$('.map-tab');
  const frames = $$('.map-frame');
  const openLink = $('.map-open-btn');

  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      const index = Number(tab.dataset.mapIndex);
      tabs.forEach((t, i) => t.classList.toggle('active', i === index));
      frames.forEach((f, i) => f.classList.toggle('active', i === index));
      openLink.href = tab.dataset.mapUrl;
    }),
  );
}

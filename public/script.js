// Точка входа: подключает все модули после разбора страницы (type="module" выполняется отложенно).
import { initCatalog } from './js/components/catalog.js';
import { initLightbox } from './js/components/lightbox.js';
import { initCart } from './js/components/cart.js';
import { initModal } from './js/components/feedback.js';
import { renderPaymentInfo, renderPaymentSelector, initPaymentSelector } from './js/components/payments.js';
import { initOrderForm } from './js/components/orderForm.js';
import { initTestimonials } from './js/components/testimonials.js';
import { initNavigation } from './js/ui/navigation.js';
import { initPreloader, initPetals, initReveal } from './js/ui/effects.js';

initPreloader();
initPetals();
initNavigation();

initCatalog();
initLightbox();
initCart();

renderPaymentInfo();
renderPaymentSelector();
initPaymentSelector();

initOrderForm();
initModal();
initTestimonials();

initReveal();

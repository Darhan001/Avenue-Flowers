// Состояние корзины. Хранится в localStorage, при любом изменении шлёт событие 'cart:change'.

const STORAGE_KEY = 'avenue_cart_v2';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

let items = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Хранилище недоступно (приватный режим): корзина живёт до перезагрузки.
  }
}

function commit() {
  persist();
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export function getCart() {
  return items;
}

export function getCartTotals() {
  return {
    count: items.reduce((sum, x) => sum + x.qty, 0),
    total: items.reduce((sum, x) => sum + x.price * x.qty, 0),
  };
}

export function addToCart(product) {
  const existing = items.find((x) => x.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    const { id, name, price, image } = product;
    items.push({ id, name, price, image, qty: 1 });
  }
  commit();
}

export function changeQty(id, delta) {
  const item = items.find((x) => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) items = items.filter((x) => x.id !== id);
  commit();
}

export function removeFromCart(id) {
  items = items.filter((x) => x.id !== id);
  commit();
}

export function clearCart() {
  items = [];
  commit();
}

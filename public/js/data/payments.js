// Способы оплаты. Единый источник данных для фронтенда и сервера.
export const paymentMethods = [
  {
    id: 'mbank',
    name: 'Мбанк',
    desc: 'Оплата через приложение Мбанк. Перевод по номеру телефона или QR-коду.',
    icon: '🏦',
    color: '#e53935',
    bgColor: '#ffebee',
    badge: 'Популярно',
    number: '+996 501 21 01 23'
  },
  {
    id: 'optima',
    name: 'Optima Bank',
    desc: 'Перевод через Optima24 или банковский терминал.',
    icon: '💳',
    color: '#1976d2',
    bgColor: '#e3f2fd',
    badge: null,
    number: null
  },
  {
    id: 'elcart',
    name: 'Элкарт',
    desc: 'Национальная платёжная карта Кыргызстана. Приём через POS-терминал.',
    icon: '🇰🇬',
    color: '#388e3c',
    bgColor: '#e8f5e9',
    badge: null,
    number: null
  },
  {
    id: 'bakai',
    name: 'Бакай Банк',
    desc: 'Перевод через Бакай24 или Bakay Pay на номер карты.',
    icon: '🏛️',
    color: '#7b1fa2',
    bgColor: '#f3e5f5',
    badge: null,
    number: null
  },
  {
    id: 'demir',
    name: 'Демир Банк',
    desc: 'Оплата через DemirBank Online или по реквизитам.',
    icon: '🔵',
    color: '#0097a7',
    bgColor: '#e0f7fa',
    badge: null,
    number: null
  },
  {
    id: 'cash',
    name: 'Наличные',
    desc: 'Оплата при получении или в магазине. Без комиссии.',
    icon: '💵',
    color: '#f57c00',
    bgColor: '#fff3e0',
    badge: 'При доставке',
    number: null
  }
];

# Avenue Flowers — сайт цветочной лавки (Ош)

## Структура

```
server.js                  точка входа Node/Express
src/
  config.js                настройки из переменных окружения
  app.js                   сборка приложения: статика, API, SEO
  routes/orders.js         POST /api/orders — приём заявок (с rate-limit)
  routes/seo.js            /sitemap.xml, /robots.txt
  services/telegram.js     отправка сообщения в Telegram
  services/orderMessage.js текст заявки (с экранированием HTML)
  validation/order.js      проверка заявки, цены берутся из каталога на сервере
public/
  index.html               разметка страницы
  style.css                все стили (разделы помечены комментариями)
  script.js                точка входа фронтенда (ES-модули, без сборщика)
  js/
    data/                  каталог, способы оплаты, опции формы (общие с сервером)
    state/cart.js          корзина (localStorage + событие cart:change)
    components/            каталог, лайтбокс, корзина, форма, оплата, карты, отзывы
    ui/                    навигация, прелоадер, лепестки, появление блоков
    utils/                 форматирование и DOM-хелперы
```

## Запуск локально

```bash
npm install
cp .env.example .env     # заполнить TG_TOKEN и TG_CHAT_ID
npm start                # http://localhost:3000
```

Открывать сайт через `npm start`, а не через Live Server: пути к модулям и API начинаются с `/`.

## Переменные окружения

| Имя | Назначение |
|---|---|
| `PORT` | порт сервера (по умолчанию 3000) |
| `SITE_URL` | публичный адрес сайта, например `https://avenueflowers.kg` — нужен для sitemap, canonical и Open Graph |
| `TG_TOKEN` | токен Telegram-бота (@BotFather) |
| `TG_CHAT_ID` | id чата, куда приходят заявки |
| `GOOGLE_SITE_VERIFICATION` | код из метатега Google Search Console (только значение content) |
| `TRUST_PROXY` | число прокси перед сервером (по умолчанию 1, как на Render) |

## Деплой

Подходит любой хостинг с Node 20+. Готов `render.yaml` для Render: подключите репозиторий, в панели задайте `SITE_URL`, `TG_TOKEN`, `TG_CHAT_ID`. Проверка работоспособности: `/healthz`.

## Чеклист запуска в Google

1. Задеплоить сайт и привязать домен с HTTPS, задать `SITE_URL` этим адресом.
2. В [Google Search Console](https://search.google.com/search-console) добавить сайт (тип «Префикс URL»), выбрать подтверждение «HTML-тег», вставить код из `content` в `GOOGLE_SITE_VERIFICATION` на Render, подтвердить владение и отправить `https://ВАШ_ДОМЕН/sitemap.xml`.
3. Создать профиль в [Google Бизнес Профиле](https://www.google.com/business/) (две точки в Оше) — это даёт карточку на Картах и в поиске по городу.
4. Проверить разметку на [Rich Results Test](https://search.google.com/test/rich-results): должна распознаться организация `Florist`.

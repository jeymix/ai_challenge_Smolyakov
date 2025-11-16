# Промпт для разработки архитектуры Backend и Frontend

## Система автоматизации перевозки автомобилей ООО «КИБЕРТРАКС»

---

## КОНТЕКСТ ПРОЕКТА

Разрабатывается веб-приложение для автоматизации процесса перевозки дорогих автомобилей закрытыми автовозами. Система состоит из двух частей:

- **Пользовательская часть**: Регистрация, заказ перевозки, расчет стоимости, оплата
- **Административная часть**: Управление заказами, городами, тарифами

**Ключевые требования:**

- Современное, гибкое решение для дальнейшего развития
- Полная документация для IT-отдела заказчика
- Сжатые сроки разработки
- Код пишется с помощью LLM (IDE Cursor)

---

## ОБЩИЕ ТРЕБОВАНИЯ К АРХИТЕКТУРЕ

### Принципы проектирования

- **Модульность**: Четкое разделение на слои (presentation, business logic, data access)
- **Масштабируемость**: Возможность добавления новых функций без переписывания существующего кода
- **Поддерживаемость**: Понятная структура, документированный код
- **DRY**: Избежание дублирования кода
- **SOLID**: Следование принципам объектно-ориентированного проектирования
- **RESTful API**: Стандартизированные endpoints для frontend

### Технические ограничения

- **Backend**: Node.js/TypeScript
- **Frontend**: Обязательно JavaScript + React
- **Стилизация**: Tailwind CSS (все SCSS/CSS должны быть заменены на Tailwind)
- **База данных**: Выбор на усмотрение (рекомендуется PostgreSQL или MongoDB)
- **Авторизация админа**: Простая, фиксированный логин/пароль в коде (без Keycloak, без внешних провайдеров)
- **Платежи**: Симуляция (все оплаты успешны, без реального процессинга)

---

## BACKEND АРХИТЕКТУРА

### Выбор технологий (рекомендации)

**Вариант 1: Node.js/TypeScript**

- **Framework**: Express.js или NestJS (рекомендуется NestJS для структурированности)
- **ORM**: TypeORM, Prisma или Sequelize
- **База данных**: PostgreSQL
- **Валидация**: class-validator, joi
- **Документация API**: Swagger/OpenAPI

### Структура проекта (пример для NestJS/TypeScript)

```
backend/
├── src/
│   ├── main.ts                    # Точка входа
│   ├── app.module.ts              # Корневой модуль
│   │
│   ├── config/                    # Конфигурация
│   │   ├── database.config.ts
│   │   ├── app.config.ts
│   │   └── constants.ts           # Константы (логин/пароль админа, тарифы)
│   │
│   ├── modules/
│   │   ├── auth/                  # Авторизация
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── guards/            # Guards для админки
│   │   │
│   │   ├── users/                 # Пользователи
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── cities/                # Города
│   │   │   ├── cities.module.ts
│   │   │   ├── cities.controller.ts
│   │   │   ├── cities.service.ts
│   │   │   ├── entities/city.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── tariffs/               # Тарифы
│   │   │   ├── tariffs.module.ts
│   │   │   ├── tariffs.controller.ts
│   │   │   ├── tariffs.service.ts
│   │   │   ├── entities/tariff.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── orders/                # Заказы
│   │   │   ├── orders.module.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── entities/order.entity.ts
│   │   │   ├── dto/
│   │   │   └── calculators/       # Логика расчета стоимости
│   │   │       ├── price-calculator.service.ts
│   │   │       └── distance-calculator.service.ts
│   │   │
│   │   └── payment/                # Оплата (симулятор)
│   │       ├── payment.module.ts
│   │       ├── payment.controller.ts
│   │       ├── payment.service.ts
│   │       └── dto/
│   │
│   ├── shared/                    # Общие модули
│   │   ├── decorators/
│   │   ├── filters/               # Exception filters
│   │   ├── interceptors/
│   │   ├── pipes/                 # Validation pipes
│   │   └── utils/
│   │       ├── distance-api.util.ts    # Интеграция с API расстояний
│   │       └── date.util.ts
│   │
│   └── database/
│       ├── migrations/            # Миграции БД
│       └── seeds/                 # Начальные данные
│
├── test/                          # Тесты
├── docs/                          # Документация
│   ├── api.md                     # Описание API
│   ├── database.md                # Схема БД
│   └── deployment.md              # Инструкции по развертыванию
│
├── package.json
├── tsconfig.json
└── README.md
```

### Модели данных (Entity/Model)

#### 1. User (Пользователь)

```typescript
{
  id: UUID (primary key)
  fullName: string (ФИО)
  phone: string (уникальный, индекс)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 2. City (Город)

```typescript
{
  id: UUID (primary key)
  name: string (уникальный, индекс)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3. Tariff (Тариф)

```typescript
{
  id: UUID (primary key)
  month: number (1-12, уникальный)
  pricePerKmUnder1000: number (цена за км при расстоянии ≤1000 км)
  pricePerKmOver1000: number (цена за км при расстоянии >1000 км)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 4. Order (Заказ)

```typescript
{
  id: UUID (primary key)
  userId: UUID (foreign key → User)
  carBrand: string (марка и модель автомобиля)
  cityFromId: UUID (foreign key → City)
  cityToId: UUID (foreign key → City)
  startDate: date (дата начала перевозки)
  distance: number (расстояние в км, рассчитанное)
  appliedTariff: number (примененный тариф руб/км)
  isFixedRoute: boolean (признак фиксированного маршрута)
  transportPrice: number (стоимость перевозки)
  insurancePrice: number (стоимость страховки, 10% от transportPrice)
  totalPrice: number (итоговая стоимость)
  durationHours: number (длительность в часах)
  durationDays: number (длительность в днях)
  estimatedArrivalDate: date (дата прибытия)
  paymentStatus: enum ('unpaid', 'paid', 'manual') (статус оплаты)
  createdAt: timestamp
  updatedAt: timestamp

  // Relations
  user: User
  cityFrom: City
  cityTo: City
}
```

### API Endpoints

#### Пользовательская часть

**Авторизация/Регистрация**

- `POST /api/auth/register` - Регистрация нового пользователя
  - Body: `{ fullName: string, phone: string }`
  - Response: `{ user: User, token?: string }` (если нужна авторизация)
- `POST /api/auth/login` - Вход по телефону (опционально, можно упростить)

**Города**

- `GET /api/cities` - Получить список доступных городов
  - Response: `City[]`

**Расчет стоимости**

- `POST /api/orders/calculate` - Рассчитать стоимость перевозки
  - Body: `{ carBrand: string, cityFromId: UUID, cityToId: UUID, startDate: string }`
  - Response: `{ distance: number, appliedTariff: number, transportPrice: number, insurancePrice: number, totalPrice: number, durationHours: number, durationDays: number, estimatedArrivalDate: string }`

**Заказы**

- `POST /api/orders` - Создать заказ
  - Body: `{ userId: UUID, carBrand: string, cityFromId: UUID, cityToId: UUID, startDate: string, ... (все рассчитанные поля) }`
  - Response: `Order`
- `GET /api/orders/:id` - Получить заказ по ID
  - Response: `Order`

**Оплата**

- `POST /api/payment/process` - Обработать оплату (симулятор)
  - Body: `{ orderId: UUID, cardData: { number: string, expiry: string, cvv: string, holderName: string } }`
  - Response: `{ success: boolean, orderId: UUID }`

#### Административная часть

**Авторизация админа**

- `POST /api/admin/auth/login` - Вход в админку
  - Body: `{ login: string, password: string }`
  - Response: `{ token: string }` (JWT или простой токен)

**Заказы (админка)**

- `GET /api/admin/orders` - Получить реестр заказов с фильтрацией
  - Query params: `?date=YYYY-MM-DD&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&cityFromId=UUID&cityToId=UUID&paymentStatus=unpaid|paid|manual&sortBy=date|price&sortOrder=asc|desc&page=1&limit=20`
  - Response: `{ orders: Order[], total: number, page: number, limit: number }`
- `GET /api/admin/orders/:id` - Получить детальную информацию о заказе
  - Response: `Order`
- `PATCH /api/admin/orders/:id/payment-status` - Изменить статус оплаты
  - Body: `{ paymentStatus: 'unpaid' | 'paid' | 'manual' }`
  - Response: `Order`

**Города (админка)**

- `GET /api/admin/cities` - Получить все города
  - Response: `City[]`
- `POST /api/admin/cities` - Создать город
  - Body: `{ name: string }`
  - Response: `City`
- `PUT /api/admin/cities/:id` - Обновить город
  - Body: `{ name: string }`
  - Response: `City`
- `DELETE /api/admin/cities/:id` - Удалить город
  - Response: `{ success: boolean }`
  - Валидация: нельзя удалить, если есть заказы с этим городом

**Тарифы (админка)**

- `GET /api/admin/tariffs` - Получить все тарифы
  - Response: `Tariff[]`
- `PUT /api/admin/tariffs/:id` - Обновить тариф
  - Body: `{ month: number, pricePerKmUnder1000: number, pricePerKmOver1000: number }`
  - Response: `Tariff`
- `POST /api/admin/tariffs` - Создать тариф (если нужно)
  - Body: `{ month: number, pricePerKmUnder1000: number, pricePerKmOver1000: number }`
  - Response: `Tariff`

### Бизнес-логика

#### Расчет стоимости перевозки

**Алгоритм:**

1. Проверка фиксированных маршрутов:

   - Москва → Сочи: 200 000 руб (независимо от сезона)
   - Бишкек → Москва: 350 000 руб
   - Если маршрут фиксированный → вернуть фиксированную стоимость, пропустить остальные шаги

2. Получение расстояния между городами:

   - Использовать внешний API (например, OpenRouteService, Google Distance Matrix API с бесплатным тарифом)
   - Или использовать офлайн JSON-матрицу расстояний
   - Кэшировать результаты в БД для оптимизации

3. Определение месяца начала перевозки и получение тарифа:

   - Извлечь месяц из `startDate`
   - Найти тариф для этого месяца в таблице `Tariff`
   - Если тарифа нет → использовать дефолтные значения (150 руб/км ≤1000, 100 руб/км >1000)

4. Расчет стоимости перевозки:

   - Если расстояние ≤ 1000 км: `transportPrice = distance * pricePerKmUnder1000`
   - Если расстояние > 1000 км: `transportPrice = distance * pricePerKmOver1000`

5. Расчет страховки:

   - `insurancePrice = transportPrice * 0.1` (10%)

6. Расчет итоговой стоимости:

   - `totalPrice = transportPrice + insurancePrice`

7. Расчет длительности и даты прибытия:
   - Норматив: 1000 км за 24 часа
   - `durationHours = (distance / 1000) * 24`
   - `durationDays = Math.ceil(durationHours / 24)`
   - `estimatedArrivalDate = startDate + durationDays`

**Сервис расчета стоимости должен быть:**

- Изолированным модулем
- Легко тестируемым
- С возможностью кэширования результатов
- С обработкой ошибок (если API расстояний недоступен)

#### Определение платежной системы

**Алгоритм:**

- По первой цифре номера карты:
  - `2` → МИР
  - `4` → Visa
  - `5` → Mastercard
  - Другие → Неизвестная система

**Реализация:**

- Функция в shared/utils
- Используется только на frontend для визуализации

### Интеграции

#### API расстояний между городами

**Вариант 1: OpenRouteService (бесплатный тариф)**

- Endpoint: `https://api.openrouteservice.org/v2/directions/driving-car`
- Требуется API ключ (бесплатная регистрация)
- Лимит: 2000 запросов/день

**Вариант 2: Google Distance Matrix API**

- Бесплатный тариф: $200 кредитов/месяц
- ~40,000 запросов/месяц

**Вариант 3: Офлайн JSON-матрица**

- Файл с предрассчитанными расстояниями между популярными городами
- Формат: `{ "Москва-Сочи": 1600, "Бишкек-Москва": 3500, ... }`
- Fallback, если API недоступен

**Рекомендация:**

- Использовать OpenRouteService как основной источник
- Иметь кэш в БД (таблица `city_distances`) для оптимизации
- Офлайн-матрицу как fallback

### Безопасность

- **Валидация входных данных**: Все DTO должны валидироваться
- **SQL Injection**: Использовать ORM с параметризованными запросами
- **CORS**: Настроить для frontend домена
- **Rate Limiting**: Ограничить количество запросов с одного IP
- **Админка**: Защитить все `/api/admin/*` endpoints guard'ами
- **Хранение пароля админа**: Хэшировать (bcrypt), даже если фиксированный

---

## FRONTEND АРХИТЕКТУРА

### Выбор технологий

**Обязательные:**

- **Framework**: React (обязательно)
- **Language**: JavaScript или TypeScript (рекомендуется TypeScript)
- **Styling**: Tailwind CSS (все стили через Tailwind, никаких SCSS/CSS файлов)
- **Build Tool**: Vite или Create React App

**Рекомендуемые:**

- **State Management**: React Context API или Zustand (для простоты) / Redux Toolkit (если нужна сложная логика)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod (валидация)
- **HTTP Client**: Axios или Fetch API
- **Date Handling**: date-fns или dayjs
- **UI Components**: Можно использовать shadcn/ui или создать свои компоненты

### Структура проекта

```
frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── main.tsx / index.jsx        # Точка входа
│   ├── App.tsx                     # Корневой компонент
│   │
│   ├── assets/                     # Статические ресурсы
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                 # Переиспользуемые компоненты
│   │   ├── ui/                     # Базовые UI компоненты
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   ├── forms/                  # Компоненты форм
│   │   │   ├── PaymentForm.tsx
│   │   │   └── OrderForm.tsx
│   │   │
│   │   └── layout/                 # Компоненты макета
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── AdminLayout.tsx
│   │
│   ├── pages/                      # Страницы
│   │   ├── public/                 # Публичные страницы
│   │   │   ├── HomePage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── OrderPage.tsx
│   │   │   ├── CalculatePage.tsx
│   │   │   ├── ConfirmPage.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   └── SuccessPage.tsx
│   │   │
│   │   └── admin/                  # Админские страницы
│   │       ├── AdminLoginPage.tsx
│   │       ├── OrdersListPage.tsx
│   │       ├── OrderDetailPage.tsx
│   │       ├── CitiesPage.tsx
│   │       └── TariffsPage.tsx
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   ├── useCities.ts
│   │   └── usePayment.ts
│   │
│   ├── services/                   # API сервисы
│   │   ├── api.ts                  # Базовый axios instance
│   │   ├── auth.service.ts
│   │   ├── orders.service.ts
│   │   ├── cities.service.ts
│   │   ├── tariffs.service.ts
│   │   └── payment.service.ts
│   │
│   ├── store/                      # State management (если используется)
│   │   ├── authStore.ts
│   │   └── ordersStore.ts
│   │
│   ├── utils/                      # Утилиты
│   │   ├── formatPrice.ts
│   │   ├── formatDate.ts
│   │   ├── validateCard.ts
│   │   ├── detectPaymentSystem.ts
│   │   └── constants.ts
│   │
│   ├── types/                      # TypeScript типы (если используется TS)
│   │   ├── user.types.ts
│   │   ├── order.types.ts
│   │   ├── city.types.ts
│   │   └── tariff.types.ts
│   │
│   └── styles/                     # Глобальные стили (минимум)
│       └── index.css               # Только Tailwind директивы
│
├── tailwind.config.js
├── package.json
├── tsconfig.json (если TypeScript)
└── README.md
```

### Роутинг

```typescript
// Пример структуры роутов (React Router v6)

Публичные роуты:
- / - Главная страница
- /register - Регистрация
- /order - Форма заказа
- /calculate - Расчет стоимости
- /confirm - Подтверждение заказа
- /payment/:orderId - Оплата
- /success/:orderId - Успешная оплата

Защищенные роуты (админка):
- /admin/login - Авторизация админа
- /admin/orders - Реестр заказов
- /admin/orders/:id - Детали заказа
- /admin/cities - Управление городами
- /admin/tariffs - Управление тарифами
```

### State Management

**Рекомендация: React Context API + useReducer**

Для простоты можно использовать:

- **Context API** для глобального состояния (авторизация, текущий пользователь)
- **Локальный state** (useState) для компонент-специфичного состояния
- **React Query / TanStack Query** (опционально) для кэширования API запросов

Если нужен более сложный state management:

- **Zustand** (легковесный)
- **Redux Toolkit** (если планируется масштабирование)

### Компоненты и их ответственность

#### UI Components (базовые)

- `Button` - Кнопка с вариантами (primary, secondary, danger)
- `Input` - Поле ввода с валидацией
- `Select` - Выпадающий список
- `Card` - Карточка для группировки контента
- `Modal` - Модальное окно
- `Table` - Таблица с сортировкой
- `Badge` - Бейдж для статусов
- `DatePicker` - Календарь выбора даты

#### Формы

- `OrderForm` - Форма заказа (марка авто, города, дата)
- `PaymentForm` - Форма оплаты (данные карты)
- `RegisterForm` - Форма регистрации

#### Страницы

Каждая страница отвечает за свой экран и использует компоненты из `components/`

### Интеграция с API

**Структура сервисов:**

```typescript
// services/api.ts - Базовый axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// Interceptors для токенов, обработки ошибок

// services/orders.service.ts
export const ordersService = {
  calculate: (data) => api.post("/orders/calculate", data),
  create: (data) => api.post("/orders", data),
  getById: (id) => api.get(`/orders/${id}`),
};
```

### Валидация форм

**Рекомендация: React Hook Form + Zod**

```typescript
// Пример валидации формы заказа
const orderSchema = z.object({
  carBrand: z.string().min(1, "Укажите марку и модель"),
  cityFromId: z.string().uuid(),
  cityToId: z.string().uuid(),
  startDate: z.date().min(new Date(), "Дата не может быть в прошлом"),
});
```

### Стилизация

**Все стили через Tailwind CSS:**

- Никаких `.scss` или `.css` файлов (кроме `index.css` с Tailwind директивами)
- Использовать utility-классы Tailwind
- Создать кастомные классы в `tailwind.config.js` для повторяющихся паттернов
- Цветовая палитра определена в конфиге Tailwind

**Пример tailwind.config.js:**

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        accent: "#D4AF37",
        success: "#10B981",
        warning: "#F59E0B",
        info: "#3B82F6",
        error: "#EF4444",
      },
    },
  },
};
```

### Особенности реализации

#### Определение платежной системы

```typescript
// utils/detectPaymentSystem.ts
export const detectPaymentSystem = (
  cardNumber: string
): "visa" | "mastercard" | "mir" | "unknown" => {
  const firstDigit = cardNumber.charAt(0);
  if (firstDigit === "4") return "visa";
  if (firstDigit === "5") return "mastercard";
  if (firstDigit === "2") return "mir";
  return "unknown";
};
```

#### Цветовая индикация статусов перевозки

```typescript
// utils/getOrderStatusColor.ts
export const getOrderStatusColor = (
  order: Order,
  selectedDate: Date
): "green" | "yellow" | "blue" => {
  const startDate = new Date(order.startDate);
  const arrivalDate = new Date(order.estimatedArrivalDate);

  if (selectedDate < startDate) return "green"; // Не уехал
  if (selectedDate >= startDate && selectedDate <= arrivalDate) return "yellow"; // В пути
  return "blue"; // Прибыл
};
```

#### Форматирование данных

- Цены: `formatPrice(price)` → "200 000 ₽"
- Даты: `formatDate(date)` → "15.01.2024"
- Телефоны: маска ввода

---

## ДОКУМЕНТАЦИЯ

### Требуемая документация

1. **README.md** (корневой)

   - Описание проекта
   - Требования (Node.js версия, БД и т.д.)
   - Инструкции по установке и запуску
   - Структура проекта

2. **API Documentation** (`docs/api.md`)

   - Описание всех endpoints
   - Примеры запросов/ответов
   - Коды ошибок
   - Swagger/OpenAPI спецификация (если возможно)

3. **Database Schema** (`docs/database.md`)

   - ER-диаграмма (текстовая или изображение)
   - Описание таблиц и связей
   - Индексы
   - Миграции

4. **Deployment Guide** (`docs/deployment.md`)

   - Инструкции по развертыванию (Docker и без Docker)
   - Переменные окружения
   - Настройка БД
   - Настройка фронтенда
   - Развертывание через Docker Compose

5. **Architecture Overview** (`docs/architecture.md`)

   - Общее описание архитектуры
   - Диаграммы (можно текстовые)
   - Описание основных модулей
   - Паттерны проектирования

6. **Development Guide** (`docs/development.md`)

   - Как добавить новый endpoint
   - Как добавить новую страницу
   - Стиль кода
   - Тестирование

7. **Docker Guide** (`docs/docker.md`)
   - Инструкции по установке Docker
   - Команды для работы с контейнерами
   - Развертывание через Docker
   - Troubleshooting
   - Оптимизация производительности

### Формат документации

- Markdown файлы
- Понятный язык (русский)
- Примеры кода
- Диаграммы (можно использовать Mermaid для текстовых диаграмм)

---

## МИГРАЦИИ И НАЧАЛЬНЫЕ ДАННЫЕ

### Миграции БД

- Использовать систему миграций (TypeORM, Prisma, Alembic и т.д.)
- Каждая миграция должна быть обратимой
- Версионирование миграций

### Начальные данные (Seeds)

1. **Города:**

   - Москва
   - Сочи
   - Бишкек
   - Другие популярные города

2. **Тарифы:**

   - Для каждого месяца (1-12) создать записи с дефолтными значениями:
     - `pricePerKmUnder1000: 150`
     - `pricePerKmOver1000: 100`
   - Администратор сможет изменить через админку

3. **Админ-пользователь:**
   - Логин/пароль (можно в конфиге или в БД)
   - Рекомендуется: создать через миграцию/seed

---

## ТЕСТИРОВАНИЕ

### Рекомендации

- **Unit тесты**: Критичная бизнес-логика (расчет стоимости)
- **Integration тесты**: API endpoints
- **E2E тесты**: Ключевые сценарии (создание заказа, оплата)

**Минимальный набор:**

- Тесты для калькулятора стоимости
- Тесты для API создания заказа
- Тесты для фильтрации заказов в админке

---

## ОКРУЖЕНИЕ И КОНФИГУРАЦИЯ

### Переменные окружения

**Backend (.env):**

```
DATABASE_URL=postgresql://user:password@localhost:5432/cybertrax
API_PORT=3000
JWT_SECRET=your-secret-key
ADMIN_LOGIN=admin
ADMIN_PASSWORD=secure-password
DISTANCE_API_KEY=your-api-key (для OpenRouteService)
DISTANCE_API_URL=https://api.openrouteservice.org/v2
NODE_ENV=development
```

**Frontend (.env):**

```
REACT_APP_API_URL=http://localhost:3000/api
```

---

## DOCKER И КОНТЕЙНЕРИЗАЦИЯ

### Общая архитектура

Система должна быть полностью контейнеризирована с использованием Docker и Docker Compose для упрощения развертывания и разработки.

**Структура Docker-файлов:**

```
project-root/
├── docker-compose.yml              # Оркестрация всех сервисов
├── docker-compose.dev.yml          # Конфигурация для разработки
├── docker-compose.prod.yml         # Конфигурация для продакшена
│
├── backend/
│   ├── Dockerfile                  # Dockerfile для backend
│   ├── Dockerfile.dev              # Dockerfile для разработки (с hot-reload)
│   └── .dockerignore
│
└── frontend/
    ├── Dockerfile                  # Dockerfile для frontend
    ├── Dockerfile.dev              # Dockerfile для разработки
    └── .dockerignore
```

### Dockerfile для Backend

**Dockerfile (production):**

```dockerfile
# backend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package files
COPY package*.json ./
COPY tsconfig.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist

# Создаем пользователя без root прав
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

**Dockerfile.dev (development):**

```dockerfile
# backend/Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

EXPOSE 3000

# Запускаем в режиме разработки с hot-reload
CMD ["npm", "run", "start:dev"]
```

### Dockerfile для Frontend

**Dockerfile (production):**

```dockerfile
# frontend/Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Dockerfile.dev (development):**

```dockerfile
# frontend/Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

EXPOSE 5173

# Запускаем dev server (Vite)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**nginx.conf для production:**

```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Compose

**docker-compose.yml (основной файл):**

```yaml
version: "3.8"

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: cybertrax-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-cybertrax}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-cybertrax_password}
      POSTGRES_DB: ${POSTGRES_DB:-cybertrax}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cybertrax-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-cybertrax}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: cybertrax-backend
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-cybertrax}:${POSTGRES_PASSWORD:-cybertrax_password}@postgres:5432/${POSTGRES_DB:-cybertrax}
      API_PORT: 3000
      JWT_SECRET: ${JWT_SECRET:-your-secret-key-change-in-production}
      ADMIN_LOGIN: ${ADMIN_LOGIN:-admin}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD:-admin123}
      DISTANCE_API_KEY: ${DISTANCE_API_KEY:-}
      DISTANCE_API_URL: ${DISTANCE_API_URL:-https://api.openrouteservice.org/v2}
      NODE_ENV: production
    ports:
      - "${API_PORT:-3000}:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - cybertrax-network
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--quiet",
          "--tries=1",
          "--spider",
          "http://localhost:3000/health",
        ]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: cybertrax-frontend
    environment:
      REACT_APP_API_URL: ${REACT_APP_API_URL:-http://localhost:3000/api}
    ports:
      - "${FRONTEND_PORT:-80}:80"
    depends_on:
      - backend
    networks:
      - cybertrax-network
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local

networks:
  cybertrax-network:
    driver: bridge
```

**docker-compose.dev.yml (для разработки):**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: cybertrax-postgres-dev
    environment:
      POSTGRES_USER: cybertrax
      POSTGRES_PASSWORD: cybertrax_password
      POSTGRES_DB: cybertrax
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
      - ./backend/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - cybertrax-network-dev

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: cybertrax-backend-dev
    environment:
      DATABASE_URL: postgresql://cybertrax:cybertrax_password@postgres:5432/cybertrax
      API_PORT: 3000
      JWT_SECRET: dev-secret-key
      ADMIN_LOGIN: admin
      ADMIN_PASSWORD: admin123
      DISTANCE_API_KEY: ${DISTANCE_API_KEY:-}
      DISTANCE_API_URL: https://api.openrouteservice.org/v2
      NODE_ENV: development
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
    networks:
      - cybertrax-network-dev
    command: npm run start:dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: cybertrax-frontend-dev
    environment:
      REACT_APP_API_URL: http://localhost:3000/api
      VITE_API_URL: http://localhost:3000/api
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - cybertrax-network-dev

volumes:
  postgres_data_dev:
    driver: local

networks:
  cybertrax-network-dev:
    driver: bridge
```

### .dockerignore файлы

**backend/.dockerignore:**

```
node_modules
npm-debug.log
dist
.env
.env.local
.git
.gitignore
README.md
*.md
.vscode
.idea
coverage
.nyc_output
test
tests
*.test.ts
*.spec.ts
```

**frontend/.dockerignore:**

```
node_modules
npm-debug.log
dist
build
.env
.env.local
.git
.gitignore
README.md
*.md
.vscode
.idea
coverage
.nyc_output
```

### Переменные окружения для Docker

**docker-compose.env (пример):**

```env
# Database
POSTGRES_USER=cybertrax
POSTGRES_PASSWORD=secure_password_change_me
POSTGRES_DB=cybertrax
POSTGRES_PORT=5432

# Backend
API_PORT=3000
JWT_SECRET=your-very-secure-secret-key-change-in-production
ADMIN_LOGIN=admin
ADMIN_PASSWORD=secure-admin-password
DISTANCE_API_KEY=your-openrouteservice-api-key
DISTANCE_API_URL=https://api.openrouteservice.org/v2
NODE_ENV=production

# Frontend
FRONTEND_PORT=80
REACT_APP_API_URL=http://localhost:3000/api
```

### Команды для работы с Docker

**Разработка:**

```bash
# Запуск всех сервисов в режиме разработки
docker-compose -f docker-compose.dev.yml up

# Запуск в фоновом режиме
docker-compose -f docker-compose.dev.yml up -d

# Остановка
docker-compose -f docker-compose.dev.yml down

# Просмотр логов
docker-compose -f docker-compose.dev.yml logs -f

# Пересборка образов
docker-compose -f docker-compose.dev.yml build --no-cache

# Выполнение миграций
docker-compose -f docker-compose.dev.yml exec backend npm run migration:run

# Выполнение seed данных
docker-compose -f docker-compose.dev.yml exec backend npm run seed
```

**Production:**

```bash
# Запуск в production режиме
docker-compose up -d

# Остановка
docker-compose down

# Пересборка
docker-compose build --no-cache

# Просмотр логов
docker-compose logs -f [service_name]

# Выполнение команд в контейнере
docker-compose exec backend npm run migration:run
docker-compose exec postgres psql -U cybertrax -d cybertrax
```

**Утилиты:**

```bash
# Очистка неиспользуемых ресурсов
docker system prune -a

# Просмотр использования ресурсов
docker stats

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Health Checks

Backend должен иметь endpoint для health check:

```typescript
// backend/src/modules/health/health.controller.ts
@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

### Миграции в Docker

**Скрипт для запуска миграций:**

```bash
#!/bin/bash
# scripts/migrate.sh

echo "Waiting for database to be ready..."
sleep 5

echo "Running migrations..."
docker-compose exec backend npm run migration:run

echo "Running seeds..."
docker-compose exec backend npm run seed

echo "Done!"
```

### Backup и восстановление БД

**Скрипт для backup:**

```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/cybertrax_backup_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump -U cybertrax cybertrax > $BACKUP_FILE

echo "Backup created: $BACKUP_FILE"
```

**Скрипт для восстановления:**

```bash
#!/bin/bash
# scripts/restore-db.sh

if [ -z "$1" ]; then
  echo "Usage: ./restore-db.sh <backup_file.sql>"
  exit 1
fi

BACKUP_FILE=$1

docker-compose exec -T postgres psql -U cybertrax -d cybertrax < $BACKUP_FILE

echo "Database restored from: $BACKUP_FILE"
```

### Оптимизация образов

**Рекомендации:**

1. Использовать multi-stage builds (уже реализовано)
2. Минимизировать количество слоев
3. Использовать `.dockerignore` для исключения ненужных файлов
4. Кэшировать зависимости (COPY package\*.json перед COPY .)
5. Использовать alpine образы для уменьшения размера
6. Не запускать контейнеры от root пользователя

### Мониторинг и логирование

**Рекомендуется добавить:**

- Логирование в stdout/stderr (Docker автоматически собирает)
- Использовать docker-compose logs для просмотра
- Для production: рассмотреть ELK stack или Loki + Grafana

### Документация Docker

Добавить в `docs/docker.md`:

- Инструкции по установке Docker
- Команды для работы с контейнерами
- Troubleshooting
- Оптимизация производительности

---

## ПРИОРИТЕТЫ РАЗРАБОТКИ

### Фаза 1: Базовая функциональность

1. Настройка проекта (backend + frontend)
2. Настройка Docker (Dockerfile для backend и frontend, docker-compose)
3. База данных и миграции
4. API для городов и тарифов
5. API расчета стоимости
6. API создания заказа
7. Базовые страницы frontend (главная, форма заказа, расчет)

### Фаза 2: Оплата и админка

1. Симулятор оплаты
2. Авторизация админа
3. Реестр заказов с фильтрацией
4. Управление городами
5. Управление тарифами

### Фаза 3: Полировка и документация

1. Валидация и обработка ошибок
2. Тестирование
3. Документация
4. Оптимизация

---

## КРИТЕРИИ УСПЕХА

✅ Все требования из ТЗ реализованы
✅ Код структурирован и понятен
✅ Документация полная и понятная
✅ Система готова к дальнейшему развитию
✅ Нет критических багов
✅ Производительность приемлемая

---

## ДОПОЛНИТЕЛЬНЫЕ РЕКОМЕНДАЦИИ

1. **Код-стайл**: Использовать ESLint/Prettier для единообразия
2. **Git**: Четкая структура коммитов, понятные сообщения
3. **Комментарии**: Комментировать сложную бизнес-логику
4. **Ошибки**: Понятные сообщения об ошибках для пользователя
5. **Логирование**: Логировать важные события (создание заказа, оплата)
6. **Производительность**: Кэширование запросов к API расстояний
7. **Адаптивность**: Frontend должен работать на десктопе и планшете

---

## ВОПРОСЫ ДЛЯ УТОЧНЕНИЯ (если нужно)

1. Нужна ли авторизация для обычных пользователей или достаточно регистрации по телефону?
2. Нужен ли личный кабинет пользователя для просмотра своих заказов?
3. Какие именно города должны быть в начальном списке?
4. Нужны ли уведомления пользователям (email/SMS) или только в системе?
5. Нужна ли история изменений заказов (кто и когда изменил статус)?

---

**ИТОГО:** Этот промпт содержит всю необходимую информацию для разработки архитектуры backend и frontend частей системы автоматизации перевозки автомобилей. Разработчик может использовать его как основу для создания детального технического задания и начала разработки.

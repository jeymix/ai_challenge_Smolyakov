# КИБЕРТРАКС - Система автоматизации перевозки автомобилей

Веб-приложение для автоматизации процесса перевозки дорогих автомобилей закрытыми автовозами.

## Технологии

### Backend
- Node.js + TypeScript
- NestJS
- TypeORM
- PostgreSQL

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- React Router

### Инфраструктура
- Docker & Docker Compose

## Быстрый старт

### Требования
- Docker и Docker Compose
- Node.js 20+ (для локальной разработки без Docker)

### Запуск через Docker (рекомендуется)

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd AI-challenge_Смольяков
```

2. Запустите в режиме разработки:
```bash
docker-compose -f docker-compose.dev.yml up
```

3. Приложение будет доступно:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs
- PostgreSQL: localhost:5432

### Запуск в production режиме

```bash
docker-compose up -d
```

- Frontend: http://localhost:80
- Backend API: http://localhost:3000

### Локальная разработка (без Docker)

#### Backend

1. Установите зависимости:
```bash
cd backend
npm install
```

2. Настройте переменные окружения (создайте `.env`):
```
DATABASE_URL=postgresql://cybertrax:cybertrax_password@localhost:5432/cybertrax
API_PORT=3000
JWT_SECRET=your-secret-key
ADMIN_LOGIN=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

3. Запустите миграции:
```bash
npm run migration:run
```

4. Запустите сервер:
```bash
npm run start:dev
```

#### Frontend

1. Установите зависимости:
```bash
cd frontend
npm install
```

2. Создайте `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

3. Запустите dev server:
```bash
npm run dev
```

## Структура проекта

```
.
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── modules/  # Модули приложения
│   │   ├── config/   # Конфигурация
│   │   └── shared/    # Общие утилиты
│   └── Dockerfile
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── Dockerfile
└── docker-compose.yml
```

## API Endpoints

### Публичные
- `GET /api/cities` - Список городов
- `POST /api/orders/calculate` - Расчет стоимости
- `POST /api/orders` - Создать заказ
- `POST /api/payment/process` - Оплата (симулятор)
- `GET /api/health` - Health check

### Админские (требуют авторизации)
- `POST /api/auth/admin/login` - Вход в админку
- `GET /api/orders` - Реестр заказов
- `PATCH /api/orders/:id/payment-status` - Изменить статус оплаты
- `GET /api/admin/cities` - Управление городами
- `GET /api/admin/tariffs` - Управление тарифами

Полная документация API доступна по адресу: http://localhost:3000/api/docs

## Учетные данные админа

По умолчанию:
- Логин: `admin`
- Пароль: `admin123`

⚠️ **Важно**: Измените пароль в production!

## Миграции и начальные данные

Для создания начальных данных (города, тарифы) выполните:

```bash
# В контейнере backend
docker-compose exec backend npm run seed
```

Или локально:
```bash
cd backend
npm run seed
```

## Разработка

### Добавление нового endpoint

1. Создайте модуль в `backend/src/modules/`
2. Добавьте entity, service, controller
3. Зарегистрируйте модуль в `app.module.ts`

### Добавление новой страницы

1. Создайте компонент в `frontend/src/pages/`
2. Добавьте роут в `App.tsx`
3. Создайте сервис для API запросов в `frontend/src/services/`

## Команды Docker

```bash
# Запуск в dev режиме
docker-compose -f docker-compose.dev.yml up

# Остановка
docker-compose -f docker-compose.dev.yml down

# Пересборка
docker-compose -f docker-compose.dev.yml build --no-cache

# Просмотр логов
docker-compose -f docker-compose.dev.yml logs -f

# Выполнение команд в контейнере
docker-compose exec backend npm run migration:run
docker-compose exec frontend npm run build
```

## Лицензия

Проект разработан для ООО «КИБЕРТРАКС»

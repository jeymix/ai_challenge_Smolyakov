# Подключение DBeaver к базе данных КИБЕРТРАКС

## Параметры подключения

### Основные параметры:

- **Тип БД:** PostgreSQL
- **Host:** `localhost` (или `127.0.0.1`)
- **Port:** `5432`
- **Database:** `cybertrax`
- **Username:** `cybertrax`
- **Password:** `cybertrax_password`

## Пошаговая инструкция

### 1. Открыть DBeaver

Запустите DBeaver на вашем компьютере.

### 2. Создать новое подключение

1. Нажмите на кнопку **"New Database Connection"** (иконка вилки/штекера) в верхней панели
2. Или через меню: **Database** → **New Database Connection**

### 3. Выбрать тип базы данных

1. В списке выберите **PostgreSQL**
2. Нажмите **Next**

### 4. Заполнить параметры подключения

#### Вкладка "Main":

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `cybertrax`
- **Username:** `cybertrax`
- **Password:** `cybertrax_password`
- ✅ Поставьте галочку **"Save password"** (если хотите сохранить пароль)

#### Вкладка "Driver properties" (опционально):

Можно оставить по умолчанию.

### 5. Проверить подключение

1. Нажмите кнопку **"Test Connection"** внизу окна
2. Если все правильно, вы увидите сообщение **"Connected"**
3. Если появляется ошибка, проверьте:
   - Запущен ли Docker контейнер с PostgreSQL
   - Правильность параметров подключения
   - Доступность порта 5432

### 6. Сохранить подключение

1. Нажмите **"Finish"**
2. Подключение появится в левой панели DBeaver

## Проверка подключения

После подключения вы должны увидеть:

- База данных `cybertrax`
- Таблицы:
  - `users`
  - `cities`
  - `tariffs`
  - `orders`
  - `migrations`

## Полезные команды для проверки

Если нужно проверить подключение через терминал:

```bash
# Проверить, что контейнер запущен
docker ps --filter "name=postgres"

# Подключиться через psql (если установлен)
psql -h localhost -U cybertrax -d cybertrax
# Пароль: cybertrax_password
```

## Решение проблем

### Ошибка "Connection refused"

- Убедитесь, что Docker контейнер запущен:
  ```bash
  docker ps --filter "name=postgres"
  ```
- Если контейнер не запущен:
  ```bash
  docker-compose -f docker-compose.dev.yml up -d postgres
  ```

### Ошибка "Authentication failed"

- Проверьте правильность пароля: `cybertrax_password`
- Проверьте имя пользователя: `cybertrax`

### Ошибка "Database does not exist"

- Убедитесь, что база данных создана:
  ```bash
  docker exec cybertrax-postgres-dev psql -U cybertrax -l
  ```

## Альтернативные параметры (если используется production)

Если вы используете production окружение, параметры могут отличаться. Проверьте файл `docker-compose.yml` для production настроек.

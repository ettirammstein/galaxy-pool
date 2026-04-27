# 🚀 Galaxy Pool - Деплой на BOS

Это руководство по деплою виджета Galaxy Pool на NEAR BOS (Blockchain Operating System).

## 📋 Предварительные требования

- Node.js установлен на вашей машине
- NEAR аккаунт (в данном случае `babloweb4.near`)
- Приватный ключ вашего аккаунта

## 🔧 Установка и настройка

### 1. Установите BOS CLI глобально

```bash
npm install -g bos-cli-rs
```

### 2. Установите зависимости проекта

```bash
npm install
```

## 📦 Структура проекта

```
galaxy-pool/
├── src/
│   ├── __init__.js          # Entry point - экспортирует компоненты
│   └── GalaxyPool.jsx       # Основной виджет
├── bos.config.json          # Конфиг BOS CLI
├── package.json             # npm скрипты
└── DEPLOY.md               # Это файл
```

## 🚀 Деплой

### Вариант 1: Используя npm скрипты (рекомендуется)

```bash
# 1. Залогиниться в NEAR
npm run login

# 2. Собрать проект
npm run build

# 3. Задеплоить на мейннет
npm run deploy

# Или на тестнет
npm run deploy:testnet
```

### Вариант 2: Прямые команды BOS CLI

```bash
# Логин
bos login

# Сборка
bos build

# Деплой
bos deploy babloweb4.near
```

## ✅ Проверка результата

После успешного деплоя, виджет будет доступен по адресу:

```
https://bos.near.org/babloweb4.near/widget/GalaxyPool
```

## 🔐 Безопасность

- **Никогда** не коммитьте приватные ключи в репозиторий
- Используйте `npm run login` для безопасной аутентификации
- Ключи хранятся локально в `~/.bos` директории

## 🆘 Решение проблем

### Ошибка "Command not found: bos"

```bash
npm install -g bos-cli-rs
```

### Ошибка аутентификации

```bash
bos login
# Введите приватный ключ или используйте interactive вход
```

### Ошибка сборки

Убедитесь, что:
- Файл `src/__init__.js` существует и экспортирует компоненты
- Все импорты в `GalaxyPool.jsx` корректны
- Синтаксис JSX правильный

```bash
npm run build
```

## 📝 Что находится в виджете

**GalaxyPool** - интерактивный виджет для розыгрыша на NEAR блокчейне:

- 🎨 Красивая галактическая тема с аним��цией
- 🔐 Проверка авторизации пользователя
- 🎯 Интеграция со смарт-контрактом `babloweb4.near`
- ⚡ Обработка ошибок и уведомления
- 📱 Адаптивный дизайн

## 📚 Дополнительные ресурсы

- [BOS Documentation](https://docs.near.org/bos)
- [NEAR Protocol](https://near.org)
- [BOS CLI GitHub](https://github.com/near/bos-cli-rs)

---

**Готово к деплою!** 🎉

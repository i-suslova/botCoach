# Telegram Coach Bot

Telegram Coach Bot - это персональный помощник тренера, который помогает пользователям вести ежедневный дневник, получать мотивирующие цитаты и выполнять ежедневные упражнения для улучшения психического и физического самочувствия.

## Features (Особенности)

- ** Ежедневный журнал: ** Пользователи могут записывать свои мысли и цели в ежедневный журнал.
- ** Мотивационные цитаты:** Получайте случайные мотивационные цитаты на русском языке.
- ** Ежедневные упражнения:** Получайте случайные ежедневные упражнения и отмечайте их как выполненные.
- ** Редактировать записи:** Редактировать существующие записи в журнале.

## Commands

- `/start` - 🚀 Запустите бота и зарегистрируйтесь в качестве пользователя.
- `/diary" - 📔 Начните вести дневник.
- "/view" - 📖 Просмотр записей в дневнике.
- "/edit" - ✏ Редактировать запись в дневнике.
- `/quoteru` - 📜 Получите мотивирующую цитату на русском языке.
- `/exercises` - 📜 Получать ежедневные упражнения.
- "/done" - ✅ Отметить упражнение как выполненное.

## How It Works

### Daily Journal

Пользователи могут записывать свои мысли и цели в ежедневный журнал. Записи можно просматривать и редактировать в любое время.

### Motivational Quotes

Пользователи могут получить случайную мотивационную цитату на русском языке, используя команду `/quoteru`.

### Daily Exercises

Пользователи могут получать произвольные упражнения для выполнения в течение дня. Они могут получать до двух упражнений в день. Пользователи также могут отмечать упражнения как выполненные.

### Technical Details

- **Backend:** Node.js
- **Database:** PostgreSQL

### Tables

- **users**: Хранит информацию о пользователях.
- **entries**: Хранит записи в журнале.
- **exercises**: Хранит подробную информацию об упражнениях.
- **user_exercises**:  Хранит взаимосвязь между пользователями и упражнениями, включая статус завершения.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

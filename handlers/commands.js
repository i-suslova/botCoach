const db = require('../utils/dbPostgres'); // Используйте PostgreSQL
const { setCommands } = require('./setCommands');

let categories = ['💼 Работа', '🏠 Личное', '💪 Здоровье'];

const createEntry = async (ctx) => {
  console.log('createEntry called');
  try {
    await ctx.reply('Выберите нужную страницу:', {
      reply_markup: {
        inline_keyboard: categories.map(category => [{ text: category, callback_data: `category_${category}` }])
      }
    });
    ctx.session.awaitingCategory = true;
  } catch (error) {
    console.error('Error in createEntry:', error);
    await ctx.reply('Произошла ошибка при создании записи. Пожалуйста, попробуйте снова.');
  }
  await setCommands(ctx);
};

const viewEntries = async (ctx) => {
  console.log('viewEntries called');
  const userId = ctx.from.id;
  console.log(`viewEntries userId: ${userId}`);

  try {
    const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
    if (userRes.rows.length === 0) {
      ctx.reply('Пользователь не найден в базе данных.');
      return;
    }
    const user_id = userRes.rows[0].user_id;
    console.log(`viewEntries user_id: ${user_id}`);

    const res = await db.query('SELECT * FROM entries WHERE user_id = $1', [user_id]);
    if (res.rows.length === 0) {
      ctx.reply('Ваш дневник пуст.');
    } else {
      const entries = res.rows.map((row, index) => `${index + 1}. ${row.text} (${row.category}, Запись была сделана: ${row.date})`).join('\n\n');
      ctx.reply(`Ваши записи:\n\n${entries}`);
    }
  } catch (err) {
    console.error('Error in viewEntries:', err);
    ctx.reply('Произошла ошибка при чтении записей.');
  }

  await setCommands(ctx);
};

const editEntry = async (ctx) => {
  console.log('editEntry called');
  try {
    await ctx.reply('Выберите страницу, где хотели бы внести изменения:', {
      reply_markup: {
        inline_keyboard: categories.map(category => [{ text: category, callback_data: `edit_category_${category}` }])
      }
    });
    ctx.session.awaitingEditCategory = true;
  } catch (error) {
    console.error('Error in editEntry:', error);
    await ctx.reply('Произошла ошибка при выборе страницы для редактирования. Пожалуйста, попробуйте снова.');
  }
  await setCommands(ctx);
};

const handleEditCallbackQueries = async (ctx) => {
  try {
    console.log('handleEditCallbackQueries called');
    const data = ctx.callbackQuery.data;
    console.log(`Callback data: ${data}`);

    if (data.startsWith('edit_category_')) {
      const category = data.split('_')[2];
      console.log(`Editing entries in category: ${category}`);
      const userId = ctx.from.id;

      try {
        const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
        if (userRes.rows.length === 0) {
          ctx.reply('Пользователь не найден в базе данных.');
          return;
        }
        const user_id = userRes.rows[0].user_id;

        const res = await db.query('SELECT * FROM entries WHERE user_id = $1 AND category = $2', [user_id, category]);
        if (res.rows.length === 0) {
          await ctx.reply('В выбранной категории нет записей.');
        } else {
          const entries = res.rows.map((row, index) => ({
            text: `${index + 1}. ${row.text} (Дата и время: ${row.date})`,
            callback_data: `edit_${row.entry_id}`
          }));
          await ctx.reply('Выберите запись для редактирования:', {
            reply_markup: {
              inline_keyboard: entries.map(entry => [{ text: entry.text, callback_data: entry.callback_data }])
            }
          });
          ctx.session.awaitingEdit = true;
        }
      } catch (err) {
        console.error('Error in handleEditCallbackQueries (edit_category_):', err);
        await ctx.reply('Произошла ошибка при чтении записей.');
      }

      await setCommands(ctx);
    } else if (data.startsWith('edit_')) {
      const entryId = parseInt(data.split('_')[1]);
      console.log(`Editing entry ID: ${entryId}`);
      const userId = ctx.from.id;

      try {
        const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
        if (userRes.rows.length === 0) {
          ctx.reply('Пользователь не найден в базе данных.');
          return;
        }
        const user_id = userRes.rows[0].user_id;

        const res = await db.query('SELECT * FROM entries WHERE entry_id = $1 AND user_id = $2', [entryId, user_id]);
        if (res.rows.length === 0) {
          await ctx.reply('Ошибка: Не удалось найти запись для редактирования.');
        } else {
          const row = res.rows[0];
          console.log(`Found entry for editing: ${row.text}`);
          ctx.session.editId = entryId;
          ctx.session.awaitingEdit = true;
          ctx.session.editingText = row.text;  // Сохраняем текст записи для редактирования
          await ctx.reply(`Редактирование записи:\n\n${row.text}`, {
            reply_markup: {
              force_reply: true
            }
          });
        }
      } catch (err) {
        console.error('Error in handleEditCallbackQueries (edit_):', err);
        await ctx.reply('Произошла ошибка при чтении записи.');
      }

      await setCommands(ctx);
    }
  } catch (error) {
    console.error('Error in handleEditCallbackQueries:', error);
    await ctx.reply('Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова.');
    await setCommands(ctx);
  }
};

module.exports = { createEntry, viewEntries, editEntry, handleEditCallbackQueries };

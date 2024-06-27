const db = require('../utils/dbPostgres'); // Используйте PostgreSQL
const { setCommands } = require('./setCommands');

let categories = ['💼 Работа', '🏠 Личное', '💪 Здоровье'];

const createEntry = async (ctx) => {
  console.log('createEntry called');
  await ctx.reply('Выберите нужную страницу:', {
    reply_markup: {
      inline_keyboard: categories.map(category => [{ text: category, callback_data: `category_${category}` }])
    }
  });
  ctx.session.awaitingCategory = true;
  await setCommands(ctx);
};

const viewEntries = async (ctx) => {
  console.log('viewEntries called');
  const userId = ctx.from.id;

  try {
    const res = await db.query('SELECT * FROM entries WHERE user_id = $1', [userId]);
    if (res.rows.length === 0) {
      ctx.reply('Ваш дневник пуст.');
    } else {
      const entries = res.rows.map((row, index) => `${index + 1}. ${row.text} (${row.category}, Запись была сделана: ${row.date})`).join('\n\n');
      ctx.reply(`Ваши записи:\n\n${entries}`);
    }
  } catch (err) {
    console.error(err);
    ctx.reply('Произошла ошибка при чтении записей.');
  }

  await setCommands(ctx);
};

const editEntry = async (ctx) => {
  console.log('editEntry called');
  await ctx.reply('Выберите страницу, где хотели бы внести изменения:', {
    reply_markup: {
      inline_keyboard: categories.map(category => [{ text: category, callback_data: `edit_category_${category}` }])
    }
  });
  ctx.session.awaitingEditCategory = true;
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
        const res = await db.query('SELECT * FROM entries WHERE user_id = $1 AND category = $2', [userId, category]);
        if (res.rows.length === 0) {
          await ctx.reply('В выбранной категории нет записей.');
        } else {
          const entries = res.rows.map((row, index) => ({
            text: `${index + 1}. ${row.text} (Дата и время: ${row.date})`,
            callback_data: `edit_${row.id}`
          }));
          await ctx.reply('Выберите запись для редактирования:', {
            reply_markup: {
              inline_keyboard: entries.map(entry => [{ text: entry.text, callback_data: entry.callback_data }])
            }
          });
          ctx.session.awaitingEdit = true;
        }
      } catch (err) {
        console.error(err);
        await ctx.reply('Произошла ошибка при чтении записей.');
      }

      await setCommands(ctx);
    } else if (data.startsWith('edit_')) {
      const entryId = parseInt(data.split('_')[1]);
      console.log(`Editing entry ID: ${entryId}`);
      const userId = ctx.from.id;

      try {
        const res = await db.query('SELECT * FROM entries WHERE id = $1 AND user_id = $2', [entryId, userId]);
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
        console.error(err);
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

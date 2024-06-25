const connectDb = require('../utils/db');
const { setCommands } = require('./setCommands');

let categories = ['💼 Работа', '🏠 Личное', '💪 Здоровье'];

const createEntry = async (ctx) => {
  console.log('createEntry called');
  await ctx.reply('Выберите категорию записи:', {
    reply_markup: {
      inline_keyboard: categories.map(category => [{ text: category, callback_data: `category_${category}` }])
    }
  });
  ctx.session.awaitingCategory = true;
  await setCommands(ctx);
};

const viewEntries = async (ctx) => {
  console.log('viewEntries called');
  const db = connectDb();
  const userId = ctx.from.id;

  db.all(`SELECT * FROM entries WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      ctx.reply('Произошла ошибка при чтении записей.');
      return;
    }

    if (rows.length === 0) {
      ctx.reply('Ваш дневник пуст.');
    } else {
      const entries = rows.map((row, index) => `${index + 1}. ${row.text} (Категория: ${row.category}, Дата и время: ${row.date})`).join('\n\n');
      ctx.reply(`Ваши записи:\n\n${entries}`);
    }
    db.close();
  });

  await setCommands(ctx);
};

const editEntry = async (ctx) => {
  console.log('editEntry called');
  const db = connectDb();
  const userId = ctx.from.id;

  db.all(`SELECT * FROM entries WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      ctx.reply('Произошла ошибка при чтении записей.');
      return;
    }

    if (rows.length === 0) {
      ctx.reply('Ваш дневник пуст.');
    } else {
      const entries = rows.map((row, index) => ({
        text: `${index + 1}. ${row.text} (Категория: ${row.category}, Дата и время: ${row.date})`,
        callback_data: `edit_${row.id}`
      }));
      ctx.reply('Выберите запись для редактирования:', {
        reply_markup: {
          inline_keyboard: entries.map(entry => [{ text: entry.text, callback_data: entry.callback_data }])
        }
      });
      ctx.session.awaitingEdit = true;
    }
    db.close();
  });

  await setCommands(ctx);
};

const handleEditCallbackQueries = async (ctx) => {
  try {
    console.log('handleEditCallbackQueries called');
    const data = ctx.callbackQuery.data;
    console.log(`Callback data: ${data}`);

    if (data.startsWith('edit_')) {
      const entryId = parseInt(data.split('_')[1]);
      console.log(`Editing entry ID: ${entryId}`);
      const db = connectDb();
      const userId = ctx.from.id;

      db.get(`SELECT * FROM entries WHERE id = ? AND user_id = ?`, [entryId, userId], (err, row) => {
        if (err) {
          console.error(err);
          ctx.reply('Произошла ошибка при чтении записи.');
          return;
        }

        if (row) {
          console.log(`Found entry for editing: ${row.text}`);
          ctx.session.editId = entryId;
          ctx.session.awaitingEdit = true;
          ctx.reply(`Введите новую версию записи:\n\n${row.text}`);
        } else {
          ctx.reply('Ошибка: Не удалось найти запись для редактирования.');
        }
        db.close();
      });

      await setCommands(ctx);
    }
  } catch (error) {
    console.error('Error in handleEditCallbackQueries:', error);
    ctx.reply('Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова.');
    await setCommands(ctx);
  }
};

module.exports = { createEntry, viewEntries, editEntry, handleEditCallbackQueries };

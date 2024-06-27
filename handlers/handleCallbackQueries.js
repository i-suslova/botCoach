const { setCommands } = require('./setCommands');
const connectDb = require('../utils/db'); // Добавляем импорт

let categories = ['💼 Работа', '🏠 Личное', '💪 Здоровье'];

const handleCallbackQueries = async (ctx) => {
  try {
    const data = ctx.callbackQuery.data;

    if (data === 'create_entry') {
      await ctx.reply('Выберите нужную страницу:', {
        reply_markup: {
          inline_keyboard: categories.map(category => [{ text: category, callback_data: `category_${category}` }])
        }
      });
      ctx.session.awaitingCategory = true;
      await setCommands(ctx);
    } else if (data.startsWith('category_')) {
      const category = data.split('_')[1];
      ctx.session.category = category;
      ctx.session.awaitingCategory = false;
      await ctx.reply('Введите вашу запись:');
      ctx.session.creatingEntry = true;
      await setCommands(ctx);
    } else if (data === 'view_entries') {
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
            text: `${index + 1}. ${row.text} ( ${row.category}, Запись была сделана: ${row.date})`,
            callback_data: `edit_${row.id}`
          }));
          ctx.reply('Ваши записи:', {
            reply_markup: {
              inline_keyboard: entries.map(entry => [{ text: entry.text, callback_data: entry.callback_data }])
            }
          });
        }
        db.close();
      });

      await setCommands(ctx);
    }
  } catch (error) {
    console.error('Error in handleCallbackQueries:', error);
    ctx.reply('Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова.');
    await setCommands(ctx);
  }
};

module.exports = { handleCallbackQueries };

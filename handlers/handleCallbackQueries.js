const { setCommands } = require('./setCommands');
const db = require('../utils/dbPostgres'); // Используйте PostgreSQL

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
          const entries = res.rows.map((row, index) => ({
            text: `${index + 1}. ${row.text} (${row.category}, Запись была сделана: ${row.date})`,
            callback_data: `edit_${row.entry_id}`
          }));
          ctx.reply('Ваши записи:', {
            reply_markup: {
              inline_keyboard: entries.map(entry => [{ text: entry.text, callback_data: entry.callback_data }])
            }
          });
        }
      } catch (err) {
        console.error('Error in handleCallbackQueries (view_entries):', err);
        ctx.reply('Произошла ошибка при чтении записей.');
      }

      await setCommands(ctx);
    }
  } catch (error) {
    console.error('Error in handleCallbackQueries:', error);
    ctx.reply('Произошла ошибка при обработке запроса. Пожалуйста, попробуйте снова.');
    await setCommands(ctx);
  }
};

module.exports = { handleCallbackQueries };

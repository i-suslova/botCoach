const connectDb = require('../utils/db');
const { setCommands } = require('./setCommands');

const handleMessages = async (ctx) => {
  console.log('handleMessages called')
  const db = connectDb();

  try {
    if (ctx.session.awaitingName) {
      const userId = ctx.from.id;
      const name = ctx.message.text;

      // Сохранение имени пользователя в базу данных
      await db.run(`UPDATE users SET name = ? WHERE user_id = ?`, [name, userId]);
      ctx.session.awaitingName = false;
      await ctx.reply(`Спасибо, ${name}! Я запомнил вас. Можете начинать записывать свои мысли и цели.`);
      await setCommands(ctx);
    } else if (ctx.session.creatingEntry) {
      const now = new Date();
      const timestamp = now.toLocaleString();
      const userId = ctx.from.id;
      const text = ctx.message.text;
      const category = ctx.session.category || 'Без категории';

      // Сохранение записи в базу данных
      await db.run(`INSERT INTO entries (user_id, text, category, date) VALUES (?, ?, ?, ?)`, [userId, text, category, timestamp], (err) => {
        if (err) {
          console.error('Database error:', err);
          ctx.reply('Произошла ошибка при сохранении записи.');
          return;
        }

        ctx.reply(`Запись добавлена в дневник:\n\n${text}\n\nКатегория: ${category}\nДата и время: ${timestamp}`);
      });

      ctx.session.creatingEntry = false;
      ctx.session.category = null;
      await setCommands(ctx);
    } else if (ctx.session.awaitingEdit) {
      if (ctx.message.reply_to_message && ctx.message.reply_to_message.text.includes('Редактирование записи:')) {
        console.log(`Editing entry ID: ${ctx.session.editId}`);
        const entryId = ctx.session.editId;
        const newText = ctx.message.text;

        // Обновление записи в базе данных
        await db.run(`UPDATE entries SET text = ? WHERE id = ?`, [newText, entryId], (err) => {
          if (err) {
            console.error('Database error:', err);
            ctx.reply('Произошла ошибка при обновлении записи.');
            return;
          }

          ctx.reply(`Запись обновлена:\n\n${newText}`);
        });

        ctx.session.awaitingEdit = false;
        ctx.session.editId = undefined;
        ctx.session.editingText = undefined;
        console.log('Entry updated');
        await setCommands(ctx);
      } else {
        console.log('Not a reply to the expected message or not in edit mode');
        await ctx.reply('Неизвестная команда. Используйте /diary для работы с дневником.');
        await setCommands(ctx);
      }
    } else {
      console.log('Not in any expected state');
      await ctx.reply('Неизвестная команда. Используйте /diary для работы с дневником.');
      await setCommands(ctx);
    }
  } catch (error) {
    console.error('Error in handleMessages:', error);
    ctx.reply('Произошла ошибка при обработке сообщения. Пожалуйста, попробуйте снова.');
  } finally {
    db.close();
  }
};

module.exports = { handleMessages };










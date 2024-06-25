const connectDb = require('../utils/db');
const { setCommands } = require('./setCommands');

const handleMessages = async (ctx) => {
  console.log('handleMessages called');
  const db = await connectDb();

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
          console.error(err);
          ctx.reply('Произошла ошибка при сохранении записи.');
          return;
        }

        ctx.reply(`Запись добавлена в дневник:\n\n${text}\n\nКатегория: ${category}\nДата и время: ${timestamp}`);
      });

      ctx.session.creatingEntry = false;
      ctx.session.category = null;
      await setCommands(ctx);
    } else if (ctx.session.awaitingEdit) {
      console.log(`Editing entry ID: ${ctx.session.editId}`);
      const entryId = ctx.session.editId;
      const newText = ctx.message.text;

      // Обновление записи в базе данных
      await db.run(`UPDATE entries SET text = ? WHERE id = ?`, [newText, entryId], (err) => {
        if (err) {
          console.error(err);
          ctx.reply('Произошла ошибка при обновлении записи.');
          return;
        }

        ctx.reply(`Запись обновлена:\n\n${newText}`);
      });

      ctx.session.awaitingEdit = false;
      ctx.session.editId = undefined;
      await setCommands(ctx);
    } else {
      await ctx.reply('Неизвестная команда. Используйте /diary для работы с дневником.');
      await setCommands(ctx);
    }
  } catch (error) {
    console.error('Error in handleMessages:', error);
    ctx.reply('Произошла ошибка при обработке сообщения. Пожалуйста, попробуйте снова.');
  }
};

module.exports = { handleMessages };

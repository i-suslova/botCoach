const db = require('../utils/dbPostgres'); // Используйте PostgreSQL
const { setCommands } = require('./setCommands');
const { getRandomMorningGreeting } = require('../utils/morningGreetings');
const { getRandomAnswerPlease } = require('../utils/answerPlease');

const handleMessages = async (ctx) => {
  console.log('handleMessages called');

  try {
    if (ctx.session.awaitingName) {
      const userId = ctx.from.id;
      const name = ctx.message.text;

      // Сохранение имени пользователя в базу данных
      const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
      if (userRes.rows.length === 0) {
        await db.query('INSERT INTO users (telegram_id, name) VALUES ($1, $2)', [userId, name]);
      } else {
        await db.query('UPDATE users SET name = $1 WHERE user_id = $2', [name, userRes.rows[0].user_id]);
      }

      ctx.session.awaitingName = false;
      await ctx.reply(`Спасибо, ${name}! Очень приятно. Я запомнил вас. Можете начинать записывать свои мысли и цели.`);
      await setCommands(ctx);
    } else if (ctx.session.creatingEntry) {
      const now = new Date();
      const timestamp = now.toLocaleString();
      const userId = ctx.from.id;
      const text = ctx.message.text;
      const category = ctx.session.category || 'Без категории';

      // Сохранение записи в базу данных
      const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
      const user_id = userRes.rows[0].user_id;
      await db.query('INSERT INTO entries (user_id, text, category, date) VALUES ($1, $2, $3, $4)', [user_id, text, category, timestamp]);
      ctx.reply(`Запись добавлена в дневник:\n\n${text}\n\nКатегория: ${category}\nДата и время: ${timestamp}`);

      ctx.session.creatingEntry = false;
      ctx.session.category = null;
      await setCommands(ctx);
    } else if (ctx.session.awaitingEdit && ctx.message.reply_to_message && ctx.message.reply_to_message.text.includes('Редактирование записи:')) {
      console.log(`Editing entry ID: ${ctx.session.editId}`);
      const entryId = ctx.session.editId;
      const newText = ctx.message.text;

      // Обновление записи в базе данных
      await db.query('UPDATE entries SET text = $1 WHERE entry_id = $2', [newText, entryId]);
      ctx.reply(`Замечательно, запись обновлена:\n\n${newText}`);

      ctx.session.awaitingEdit = false;
      ctx.session.editId = undefined;
      ctx.session.editingText = undefined;
      await setCommands(ctx);
    } else {
      // Обработка ключевых слов
      const messageText = ctx.message.text.toLowerCase();

      if (messageText.includes('спасибо')) {
        const answerPl = getRandomAnswerPlease();
        if (typeof answerPl === 'string') {
          await ctx.reply(answerPl);
        } else if (answerPl.type === 'sticker') {
          await ctx.replyWithSticker(answerPl.id);
        }
      } else if (/привет|доброе утро|здравствуйте|здравствуй|приветствую вас/i.test(messageText)) {
        const now = new Date();
        const hours = now.getHours();

        const userId = ctx.from.id;
        const userRes = await db.query('SELECT name FROM users WHERE telegram_id = $1', [userId]);
        const userName = userRes.rows[0].name;

          if (hours < 12 && hours >= 4) {
          // const greeting = getRandomMorningGreeting();
          const greeting = getRandomMorningGreeting(userName);
          await ctx.reply(greeting);
        } else {
          await ctx.reply(`Приветствую, ${userName}! Чем могу помочь?`);
        }
      } else {
        await ctx.reply('Извините, я не распознал эту команду. Пожалуйста, выберите действие из МЕНЮ.');
      }

      await setCommands(ctx);
    }
  } catch (error) {
    console.error('Error in handleMessages:', error);
    ctx.reply('Произошла ошибка при обработке сообщения. Пожалуйста, попробуйте снова.');
  }
};

module.exports = { handleMessages };

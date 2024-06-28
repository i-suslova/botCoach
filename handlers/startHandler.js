const db = require('../utils/dbPostgres'); // Используйте PostgreSQL

const startHandler = async (ctx) => {
  console.log('startHandler called');
  const userId = ctx.from.id;

  try {
    // Проверка, есть ли пользователь в базе данных
    const res = await db.query('SELECT * FROM users WHERE telegram_id = $1', [userId]);
    if (res.rows.length === 0) {
      // Пользователь не найден, запрос имени
      ctx.session.awaitingName = true;
      await ctx.reply('Привет! Как вас зовут?');
    } else {
      const userName = res.rows[0].name;
      await ctx.reply(`Привет, ${userName}! Чем могу помочь?`);
    }
  } catch (error) {
    console.error('Error in startHandler:', error);
    await ctx.reply('Произошла ошибка при обработке команды. Пожалуйста, попробуйте снова.');
  }
};

module.exports = startHandler;

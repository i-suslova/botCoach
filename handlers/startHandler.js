const { diaryMenu } = require('../menus/diaryMenu');

module.exports = async (ctx) => {
  await ctx.reply('<b>Привет!</b>\nЯ ваш личный дневник. Можете начинать записывать свои мысли и цели.', {
    parse_mode: 'HTML',
    reply_markup: diaryMenu
  });

  // Установка команд бота
  await ctx.api.setMyCommands([
     { command: 'start', description: '🚀 Начать' },
    { command: 'create', description: 'Создать запись' },
    { command: 'view', description: 'Просмотр записей' },
  ]);
};


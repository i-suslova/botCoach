const db = require('../utils/dbPostgres'); // Используйте PostgreSQL
const { diaryMenu } = require('../menus/diaryMenu');
const { setCommands } = require('./setCommands');
const { handleMessages } = require('./handleMessages');
const { handleCallbackQueries } = require('./handleCallbackQueries');
const { createEntry, viewEntries, editEntry, handleEditCallbackQueries } = require('./commands');

const diaryHandler = async (ctx) => {
  try {
    await ctx.reply('Что вы хотите сделать?', { reply_markup: diaryMenu });
    await setCommands(ctx);
  } catch (error) {
    console.error('Error in diaryHandler:', error);
    ctx.reply('Произошла ошибка при выполнении команды. Пожалуйста, попробуйте снова.');
  }
};

module.exports = { diaryHandler, handleMessages, handleCallbackQueries, createEntry, viewEntries, editEntry, handleEditCallbackQueries };

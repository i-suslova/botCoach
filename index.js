require('dotenv').config();
const { Bot, GrammyError, HttpError } = require('grammy');
const { useSession } = require('./utils/session');
const startHandler = require('./handlers/startHandler');
const { diaryHandler, handleCallbackQueries, handleMessages, createEntry, viewEntries, editEntry, handleEditCallbackQueries } = require('./handlers/diaryHandler');
const { setCommands } = require('./handlers/setCommands');

const bot = new Bot(process.env.BOT_API_KEY);

// Use session middleware
bot.use(useSession);

// Register handlers
bot.command('start', startHandler);
bot.command('diary', diaryHandler);
bot.command('create', createEntry);
bot.command('view', viewEntries);
bot.command('edit', editEntry); // Новая команда для редактирования

// Use diary menu
bot.on('callback_query:data', async (ctx) => {
  await handleEditCallbackQueries(ctx);
  await handleCallbackQueries(ctx);
});

// Handle messages
bot.on('message', handleMessages);

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);

  const e = err.error;
  if (e instanceof GrammyError) {
    console.error(`Error in request: ${e.description}`);
  } else if (e instanceof HttpError) {
    console.error(`Could not contact Telegram: ${e.message}`);
  } else {
    console.error(`Unknown error: ${e.message}`);
  }
});

// Initial setting of commands
setCommands(bot);

bot.start();

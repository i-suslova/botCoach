require('dotenv').config();

const { Bot, GrammyError, HttpError } = require('grammy');
const { useSession } = require('./utils/session');
const startHandler = require('./handlers/startHandler');
const { diaryHandler, handleCallbackQueries, handleMessages, viewEntries, editEntry, handleEditCallbackQueries } = require('./handlers/diaryHandler');
const { setCommands } = require('./handlers/setCommands');
const { getQuoteInRussian } = require('./utils/quoteAPI');
const { sendRandomExercise } = require('./handlers/exerciseHandler');
const { listTodayExercises, toggleExerciseStatus, markExerciseAsDone } = require('./handlers/doneHandler');
const { initializeExercises } = require('./utils/exercises');

console.log("Starting bot...");
const bot = new Bot(process.env.BOT_API_KEY);

// Initialize exercises table
initializeExercises();

// Use session middleware
bot.use(useSession);

// Register handlers
bot.command('start', startHandler);
bot.command('diary', diaryHandler);
bot.command('view', viewEntries);
bot.command('edit', editEntry);
bot.command('exercises', sendRandomExercise);
bot.command('done', listTodayExercises);

// Command to send random quote in Russian
const sendRandomQuoteInRussian = async (ctx) => {
  console.log("Fetching quote in Russian...");
  const quote = await getQuoteInRussian();
  await ctx.reply(quote);
};

bot.command('quoteru', sendRandomQuoteInRussian);

bot.on('callback_query:data', async (ctx) => {
  console.log("Handling callback query...");
  const data = ctx.callbackQuery.data;
  if (data.startsWith('status_')) {
    await toggleExerciseStatus(ctx);
  } else if (data.startsWith('done_')) {
    await markExerciseAsDone(ctx);
  } else {
    await handleEditCallbackQueries(ctx);
    await handleCallbackQueries(ctx);
  }
});

// Handle messages
bot.on('message', (ctx) => {
  console.log("Handling message...");
  handleMessages(ctx);
});

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
console.log("Bot started.");
module.exports = { bot };

const setCommands = async (bot) => {
  await bot.api.setMyCommands([
    { command: 'start', description: '🚀 Начать' },
    { command: 'diary', description: '📔 В дневнике можно записывать свои мысли и цели' },
    { command: 'view', description: '📖 Можно посмотреть свои записи.' },
    { command: 'edit', description: '✏️ Можно отредактировать свою запись' },
    { command: 'quoteru', description: '📜 Получи вдохновляющую цитату.' },
    { command: 'exercises', description: '📜 Получи упражнение дня' },
    { command: 'done', description: '✅ Отметить упражнение как выполненное' }
  ]);
};

module.exports = { setCommands };

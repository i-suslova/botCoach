const setCommands = async (bot) => {
  await bot.api.setMyCommands([
    { command: 'start', description: '🚀 Начать' },
    { command: 'diary', description: '📔 В дневнике можно записывать свои мысли и цели' },
    { command: 'view', description: '📖 Можно посмотреть свои записи' },
    { command: 'edit', description: '✏️ Можно отредактировать свою запись' },
    { command: 'quoteen', description: '📜 Получи вдохновляющую цитату на английском языке' },
    { command: 'quoteru', description: '📜 Получи вдохновляющую цитату на русском языке' }
  ]);
};

module.exports = { setCommands };

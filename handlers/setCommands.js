async function setCommands(ctx) {
    await ctx.api.setMyCommands([
      { command: 'start', description: '🚀 Начать' },
      { command: 'diary', description: '📔 Открыть дневник' },
      { command: 'create', description: '📝 Создать запись' },
      { command: 'view', description: '📖 Просмотр записей' },
      { command: 'edit', description: '✏️ Редактировать запись' }
    ]);
  }
  
  module.exports = { setCommands };
  
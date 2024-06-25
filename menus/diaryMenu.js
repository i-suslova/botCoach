const { InlineKeyboard } = require('grammy');

const diaryMenu = new InlineKeyboard()
  .text('📝 Создать запись', 'create_entry').row()
  .text('📖 Просмотр записей', 'view_entries')
//   .text('🔍 Найти запись', 'find_entry')
//   .text('🔍 Найти запись', 'find_entry').row()
//   .text('⚙️ Настройки', 'settings');

module.exports = { diaryMenu };




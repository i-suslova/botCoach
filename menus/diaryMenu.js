const { InlineKeyboard } = require('grammy');

const diaryMenu = new InlineKeyboard()
  .text('📝 Создать запись', 'create_entry').row()
  .text('📖 Просмотр записей', 'view_entries')

module.exports = { diaryMenu };




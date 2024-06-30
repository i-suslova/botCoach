const { getExercises } = require('../utils/exercises');
const db = require('../utils/dbPostgres');

const listTodayExercises = async (ctx) => {
  const userId = ctx.from.id;
  const date = new Date().toISOString().split('T')[0]; // текущая дата в формате YYYY-MM-DD

  try {
    const res = await db.query('SELECT exercise_id, done FROM user_exercises WHERE user_id = (SELECT user_id FROM users WHERE telegram_id = $1) AND date = $2', [userId, date]);

    if (res.rows.length === 0) {
      await ctx.reply('Вы еще не получили упражнений на сегодня.');
    } else {
      const exercises = getExercises();
      const todayExercises = res.rows.map(row => {
        const exercise = exercises.find(ex => ex.id === row.exercise_id);
        return { ...exercise, done: row.done };
      });

      const buttons = todayExercises.map(exercise => {
        const status = exercise.done ? 'Выполнено 🤩' : 'Не выполнено';
        return [{ text: `${exercise.name} (${status})`, callback_data: `status_${exercise.id}` }];
      });

      await ctx.reply('Не забудьте отметить выполненное упражнение!', {
        reply_markup: {
          inline_keyboard: buttons
        }
      });
    }
  } catch (error) {
    console.error('Error listing today\'s exercises:', error);
    await ctx.reply('Произошла ошибка при загрузке упражнений. Пожалуйста, попробуйте снова.');
  }
};

const toggleExerciseStatus = async (ctx) => {
  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;
  const exerciseId = parseInt(data.split('_')[1]); // Получаем ID упражнения из callback data

  try {
    const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
    if (userRes.rows.length === 0) {
      await ctx.reply('Пользователь не найден.');
      return;
    }
    const user_id = userRes.rows[0].user_id;

    const currentStatusRes = await db.query('SELECT done FROM user_exercises WHERE user_id = $1 AND exercise_id = $2 AND date = CURRENT_DATE', [user_id, exerciseId]);
    if (currentStatusRes.rows.length === 0) {
      await ctx.reply('Не удалось найти упражнение для изменения статуса.');
      return;
    }
    const currentStatus = currentStatusRes.rows[0].done;

    // Предложить варианты выбора "Выполнено" или "Не выполнено"
    await ctx.reply('Отметьте статус упражнения:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Выполнено ✅', callback_data: `done_${exerciseId}_true` },
            { text: 'Не выполнено', callback_data: `done_${exerciseId}_false` }
          ]
        ]
      }
    });
  } catch (error) {
    console.error('Error in toggleExerciseStatus:', error);
    await ctx.reply('Произошла ошибка при изменении статуса упражнения. Пожалуйста, попробуйте снова.');
  }
};

const markExerciseAsDone = async (ctx) => {
  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;
  const [action, exerciseId, done] = data.split('_');
  const isDone = done === 'true';

  try {
    const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
    if (userRes.rows.length === 0) {
      await ctx.reply('Пользователь не найден.');
      return;
    }
    const user_id = userRes.rows[0].user_id;

    // Обновляем запись в таблице user_exercises
    await db.query('UPDATE user_exercises SET done = $1 WHERE user_id = $2 AND exercise_id = $3 AND date = CURRENT_DATE', [isDone, user_id, exerciseId]);
    console.log(`Отмечено как ${isDone ? 'выполненное' : 'не выполненное'}: user_id = ${user_id}, exercise_id = ${exerciseId}, date = CURRENT_DATE`); // Отладочное сообщение

    await ctx.answerCallbackQuery(`Упражнение отмечено как ${isDone ? 'выполненное' : 'не выполненное'}!`);

    // Обновляем список упражнений
    await listTodayExercises(ctx);
  } catch (error) {
    console.error('Error in markExerciseAsDone:', error);
    await ctx.reply('Произошла ошибка при изменении статуса упражнения. Пожалуйста, попробуйте снова.');
  }
};

module.exports = { listTodayExercises, toggleExerciseStatus, markExerciseAsDone };

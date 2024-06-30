const { getExercises } = require('../utils/exercises');
const db = require('../utils/dbPostgres'); // Используйте PostgreSQL

const sendRandomExercise = async (ctx) => {
  const userId = ctx.from.id;
  const date = new Date().toISOString().split('T')[0]; // текущая дата в формате YYYY-MM-DD

  try {
    const res = await db.query('SELECT exercise_id FROM user_exercises WHERE user_id = (SELECT user_id FROM users WHERE telegram_id = $1) AND date = $2', [userId, date]);
    const exerciseCount = res.rows.length;

    // console.log(`Пользователь ${userId} уже получил ${exerciseCount} упражнений сегодня.`); // Отладочное сообщение

    if (exerciseCount >= 2) {
      await ctx.reply('Вы уже получили два упражнения на сегодня.');
    } else {
      const exercises = getExercises();
      const receivedExerciseIds = res.rows.map(row => row.exercise_id);
      const availableExercises = exercises.filter(exercise => !receivedExerciseIds.includes(exercise.id));

      if (availableExercises.length === 0) {
        await ctx.reply('Нет доступных упражнений для сегодня.');
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableExercises.length);
      const exercise = availableExercises[randomIndex];
      const userRes = await db.query('SELECT user_id FROM users WHERE telegram_id = $1', [userId]);
      const user_id = userRes.rows[0].user_id;
      await db.query('INSERT INTO user_exercises (user_id, exercise_id, date) VALUES ($1, $2, $3)', [user_id, exercise.id, date]);
      console.log(`Записано в базу: user_id = ${user_id}, exercise_id = ${exercise.id}, date = ${date}`); // Отладочное сообщение
      await ctx.reply(`Ваше упражнение на сегодня:\n\n${exercise.name}\n${exercise.description}`);
    }
  } catch (error) {
    console.error('Error fetching exercise:', error);
    await ctx.reply('Произошла ошибка при получении упражнения. Пожалуйста, попробуйте снова.');
  }
};

module.exports = { sendRandomExercise };

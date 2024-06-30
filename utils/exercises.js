// utils/exercises.js

const db = require('./dbPostgres'); // Используйте PostgreSQL

const exercises = [
    {
        id: 1,
        name: "Утренняя разминка",
        description: "Начните свой день с легкой утренней разминки. Включает: 10 кругов вращения плечами, 10 наклонов в стороны, 10 кругов вращения тазом."
    },
    {
        id: 2,
        name: "Глубокое дыхание",
        description: "Выполните 5 минут глубокого дыхания: медленно вдыхайте через нос, задержите дыхание на 3 секунды и медленно выдыхайте через рот."
    },
    {
        id: 3,
        name: "Медитация осознанности",
        description: "Посвятите 10 минут медитации, сосредоточившись на своем дыхании и отпуская любые негативные мысли."
    },
    {
        id: 4,
        name: "Легкая растяжка",
        description: "Потянитесь вверх, затем наклонитесь вперед, стараясь коснуться пальцев ног. Повторите 5 раз."
    },
    {
        id: 5,
        name: "Прогулка на свежем воздухе",
        description: "Выйдите на 15-минутную прогулку на свежем воздухе, сосредоточьтесь на окружающей природе и своих ощущениях."
    },
    {
        id: 6,
        name: "Танцевальная пауза",
        description: "Включите любимую музыку и танцуйте в течение 5 минут, не задумываясь о движениях."
    },
    {
        id: 7,
        name: "Упражнение 'Кошка-корова'",
        description: "Встаньте на четвереньки, медленно выгибайте спину вверх (поза кошки), затем прогибайте вниз (поза коровы). Повторите 10 раз."
    },
    {
        id: 8,
        name: "Сочинение благодарностей",
        description: "Потратьте 5 минут, чтобы записать три вещи, за которые вы благодарны сегодня."
    },
    {
        id: 9,
        name: "Легкий самомассаж",
        description: "Проведите легкий массаж плеч, шеи и головы в течение 5 минут, чтобы снять напряжение."
    },
    {
        id: 10,
        name: "Поза ребенка",
        description: "Выполните позу ребенка (баласана) на 2-3 минуты, чтобы расслабить спину и снять напряжение."
    },
    {
        id: 11,
        name: "Легкий бег на месте",
        description: "Пробегите на месте в течение 1 минуты, поддерживая легкий темп."
    },


];

const getExercises = () => exercises;

const initializeExercises = async () => {
    try {
        const res = await db.query('SELECT COUNT(*) FROM exercises');
        const count = parseInt(res.rows[0].count, 10);
        if (count === 0) {
            for (const exercise of exercises) {
                await db.query('INSERT INTO exercises (name) VALUES ($1)', [exercise.name]);
            }
            console.log('Exercises table initialized with default exercises.');
        }
    } catch (error) {
        console.error('Error initializing exercises table:', error);
    }
};

module.exports = { getExercises, initializeExercises };

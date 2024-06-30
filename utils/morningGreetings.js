const morningGreetings = [
  "Доброе утро, {name}! ☀️ Желаю вам прекрасного дня!",
  "С добрым утром, {name}! ☀️ Пусть ваш день будет полон радости и успехов!",
  "Доброе утро, {name}! ☀️ Желаю вам отличного настроения и позитивных эмоций!",
  "С добрым утром, {name}! ☀️ Пусть этот день принесет вам много радости!",
  "Доброе утро, {name}! ☀️ Желаю вам продуктивного и счастливого дня!"
];

const getRandomMorningGreeting = (name) => {
  const randomIndex = Math.floor(Math.random() * morningGreetings.length);
  return morningGreetings[randomIndex].replace('{name}', name);
};

module.exports = { getRandomMorningGreeting };

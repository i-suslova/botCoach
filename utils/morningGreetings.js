const morningGreetings = [
    "Доброе утро! Желаю вам прекрасного дня!",
    "С добрым утром! Пусть ваш день будет полон радости и успехов!",
    "Доброе утро! Желаю вам отличного настроения и позитивных эмоций!",
    "С добрым утром! Пусть этот день принесет вам много радости!",
    "Доброе утро! Желаю вам продуктивного и счастливого дня!"
  ];
  
  const getRandomMorningGreeting = () => {
    const randomIndex = Math.floor(Math.random() * morningGreetings.length);
    return morningGreetings[randomIndex];
  };
  
  module.exports = { getRandomMorningGreeting };
  
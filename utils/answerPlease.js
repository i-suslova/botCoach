const answerPlease = [
  "Рад был помочь. 😀",
  "Пожалуйста. 😀",
  "Пожалуйста! Рад помочь. 😄",
  { type: "sticker", id: "CAACAgIAAxkBAAEMYq1mfasnI9iEij2GAjLrickLwnGqGgACxgEAAhZCawpKI9T0ydt5RzUE" },
  { type: "sticker", id: "CAACAgIAAxkBAAEMYqtmfasEwsJfk-T5qOg08LqneN_dkgACFQ4AAggM6EgbwHhfw5fkTjUE" }
];

const getRandomAnswerPlease = () => {
  const randomIndex = Math.floor(Math.random() * answerPlease.length);
  return answerPlease[randomIndex];
};

module.exports = { getRandomAnswerPlease };

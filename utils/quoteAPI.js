const axios = require('axios');

// // Получение цитаты на английском языке
// const getQuoteInEnglish = async () => {
//   try {
//     const response = await axios.get('https://api.quotable.io/random');
//     return `${response.data.content} - ${response.data.author}`;
//   } catch (error) {
//     console.error('Error fetching quote in English:', error);
//     return 'Could not fetch quote at this time. Please try again later.';
//   }
// };

// Получение цитаты на русском языке
const getQuoteInRussian = async () => {
  const url = 'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru';
  const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);

  try {
    const response = await axios.get(proxyUrl);
    const data = JSON.parse(response.data.contents);
    if (data && data.quoteText) {
      return `${data.quoteText} - ${data.quoteAuthor || 'Неизвестный автор'}`;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching quote in Russian:', error);
    return 'Ошибка при загрузке цитаты. Попробуйте еще раз.';
  }
};

module.exports = { getQuoteInRussian };

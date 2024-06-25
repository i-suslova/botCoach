const sqlite3 = require('sqlite3').verbose();

const connectDb = () => {
  return new sqlite3.Database('diarybot.db', (err) => {
    if (err) {
      console.error('Could not connect to database', err);
    } else {
      console.log('Connected to database');
    }
  });
};

module.exports = connectDb;

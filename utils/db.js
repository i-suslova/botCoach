const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
require('dotenv').config();

let db;

if (process.env.DATABASE_TYPE === 'postgres') {
  const pool = new Pool({
    user: 'diaryuser',
    host: 'localhost',
    database: 'diarydb',
    password: 'yourpassword',
    port: 5432,
  });

  db = {
    query: (text, params) => pool.query(text, params),
  };
} else {
  db = {
    query: (text, params, callback) => {
      const sqliteDb = new sqlite3.Database('diarybot.db', (err) => {
        if (err) {
          console.error('Could not connect to database', err);
        } else {
          console.log('Connected to database');
        }
      });
      sqliteDb.all(text, params, callback);
      sqliteDb.close();
    },
  };
}

module.exports = db;

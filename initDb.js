const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('diarybot.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    text TEXT,
    category TEXT,
    date TEXT
  )`);
});

db.close();
console.log('Database initialized.');

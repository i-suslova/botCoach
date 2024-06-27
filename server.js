require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { bot } = require('./index'); 

const app = express();
app.use(bodyParser.json());

// Установите вебхук для бота
bot.api.setWebhook(`https://yourcoachirina.ru/bot${process.env.BOT_API_KEY}`);

app.post(`/bot${process.env.BOT_API_KEY}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});

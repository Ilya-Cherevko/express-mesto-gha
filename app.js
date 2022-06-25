// app.js — входной файл
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb')

// подключаем мидлвары, роуты и всё остальное...

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use((req, res, next) => {
  req.user = {
    _id: '62b4c429884798262bb69917' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.listen(PORT, () => {
  console.log(`Сервер работает на ${PORT} порту`);
});

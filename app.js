// app.js — входной файл;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { validationUser } = require('./utils/validation');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo;
mongoose.connect('mongodb://localhost:27017/mestodb');

// подключаем мидлвары, роуты и всё остальное...;
app.use(helmet());

app.use(bodyParser.json()); // для собирания JSON-формата

app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signin', validationUser, login);
app.post('/signup', validationUser, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use(error);

// наш централизованный обработчик
// app.use((err, req, res, next) => {
//  res.status(err.statusCode).send({ message: err.message });
// });

// app.use((err, req, res, next) => {
// если у ошибки нет статуса, выставляем 500
//  const { statusCode = 500, message } = err;

//  res
//    .status(statusCode)
//    .send({
//      // проверяем статус и выставляем сообщение в зависимости от него
//      message: statusCode === 500
//        ? 'На сервере произошла ошибка'
//        : message
//    });
// });
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер работает на ${PORT} порту`);
});

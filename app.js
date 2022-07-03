require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { validationUser } = require('./utils/validation');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signin', validationUser, login);
app.post('/signup', validationUser, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/', auth, require('./routes/404'));

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер работает на ${PORT} порту`);
});

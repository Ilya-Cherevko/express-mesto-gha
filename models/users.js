const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { reqExpLink } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    //  required: true,
    minlength: [2, 'Должно быть не меньше 2, имеется {VALUE}'],
    maxlength: 30,
  },
  about: {
    type: String,
    defauit: 'Исследователь',
    //  required: true,
    minlength: [2, 'Должно быть не меньше 2, имеется {VALUE}'],
    maxlength: 30,
  },
  avatar: {
    type: String,
    // required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return reqExpLink.test(link);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    // unique: true,
    select: false, // необходимо добавить поле select, чтобы API не возвращал хеш пароля
  },
});
// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // пользователь не найден — отклоняем промис
        // с ошибкой и переходим в блок catch
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          // теперь user доступен
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

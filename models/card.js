const mongoose = require('mongoose');
const { regExp } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Должно быть не меньше 2, имеется {VALUE}'],
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return regExp.test(link);
      },
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);

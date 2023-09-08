const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnautorizedError');
const urlRegex = require('../utils/urlRegex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив-Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, 'Обязательное поле'],
    unique: true,
    validate: {
      validator(email) {
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Неправильный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательное поле'],
    select: false,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return urlRegex.test(url);
      },
      message: 'URL не соответствует требованиям',
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) { return Promise.reject(new UnauthorizedError('Неправильная почта или пароль')); }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) { return Promise.reject(new UnauthorizedError('Неправильные почта или пароль')); }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);

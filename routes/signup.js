const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../utils/urlRegex');
const { createUser } = require('../controllers/user');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
    avatar: Joi.string().pattern(urlRegex),
  }).unknown(true),
}), createUser);

module.exports = router;

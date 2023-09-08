const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { loginUser } = require('../controllers/user');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }).unknown(true),
}), loginUser);

module.exports = router;

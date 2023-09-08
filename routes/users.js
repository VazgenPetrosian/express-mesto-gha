const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../utils/urlRegex');
const {
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
  getInfoAboutMe,
} = require('../controllers/user');

router.get('/me', getInfoAboutMe);
router.get('/users', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserById);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex),
  }),
}), updateUserAvatarById);

module.exports = router;

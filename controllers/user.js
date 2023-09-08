const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const userModel = require('../models/user');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) throw new BadRequestError(`${email} и ${password} пустые`);
  bcrypt.hash(password, 10).then((hash) => userModel
    .create({
      name, about, avatar, email, password: hash,
    })
    .then((r) => res.status(HTTP_STATUS_CREATED).send({ data: r }))
    .catch((error) => {
      if (error === 11000) {
        next(new ConflictError(`${email} уже существует`));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      }
      next(Error);
    }));
};

const getUsers = (req, res, next) => userModel
  .find({})
  .then((r) => res.status(HTTP_STATUS_OK).send(r))
  .catch(next);

const getInfoAboutMe = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  userModel
    .findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch(next);
};
const updateUserById = (req, res, next) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  userModel
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      return next(error);
    });
};

const updateUserAvatarById = (req, res, next) => {
  userModel
    .findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      return next(error);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError(`${email} и ${password} пустые`);
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const jwtToken = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', jwtToken, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ jwtToken });
      console.log(jwtToken);
    })
    // eslint-disable-next-line consistent-return
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      next();
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
  loginUser,
  getInfoAboutMe,
};

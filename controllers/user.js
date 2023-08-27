const mongoose = require('mongoose');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
} = require('http2').constants;
const userModel = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  console.log(req.body);
  return userModel
    .create({ name, about, avatar })
    .then((r) => {
      return res.status(HTTP_STATUS_CREATED).send({ data: r });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid Data' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server Error' });
    });
};

const getUsers = (req, res) => {
  return userModel
    .find({})
    .then((r) => {
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server Error' });
    });
};

const getUserById = (req, res) => {
  const { userID } = req.params;
  return userModel
    .findById(userID)
    .then((r) => {
      if (r === null) {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res.status(HTTP_STATUS_OK).send(r);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid Id' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server Error' });
    });
};
const updateUserById = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user._id);
  userModel
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((e) =>
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server Error' })
    );
};

const updateUserAvatarById = (req, res) => {
  userModel
    .findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((e) =>
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Server Error' })
    );
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
};

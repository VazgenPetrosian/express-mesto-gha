const mongoose = require('mongoose');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
} = require('http2').constants;
const cardModel = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
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

const deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .then(() => {
      res.send({ message: 'Card remove' });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid Request' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Server Error' });
      }
    });
};

const getAllCard = (req, res) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() =>
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка сервера' })
    );
};

const createLikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Server Error' });
      }
    });
};
const createDislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    )
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid ID' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Server Error' });
      }
    });
};

module.exports = {
  createCard,
  deleteCard,
  getAllCard,
  createLikeCard,
  createDislikeCard,
};

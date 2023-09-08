const mongoose = require('mongoose');
const {HTTP_STATUS_CREATED, HTTP_STATUS_OK} = require('http2').constants;
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const cardModel = require('../models/card');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(error.message));
      }
      return next(error);
    });
};

const deleteCard = (req, res, next) => {
  cardModel
    .findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) { throw new ForbiddenError('Invalid user'); }
      cardModel.deleteOne(card).orFail().then(() => {
        res.status(HTTP_STATUS_OK).send({ message: 'Card remove' });
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Card not found'));
      }
      if (error instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Invalid card ID'));
      }
      return next(error);
    });
};

const getAllCard = (req, res, next) => {
  cardModel
    .find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

const createLikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return next(error);
    });
};
const createDislikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return next(error);
    });
};

module.exports = {
  createCard,
  deleteCard,
  getAllCard,
  createLikeCard,
  createDislikeCard,
};

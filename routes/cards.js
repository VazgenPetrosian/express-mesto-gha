const router = require('express').Router();
const {
  getAllCard,
  deleteCard,
  createCard,
  createLikeCard,
  createDislikeCard,
} = require('../controllers/card');

router.get('/cards', getAllCard);
router.delete('/:cardId', deleteCard);
router.post('/cards', createCard);
router.put('/cards/:cardId/likes', createLikeCard);
router.delete('/cards/:cardId/likes', createDislikeCard);

module.exports = router;

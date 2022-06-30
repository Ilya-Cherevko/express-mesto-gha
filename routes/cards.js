const router = require('express').Router();

const {
  validationCard,
  validationCardId,
} = require('../utils/validation');

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', validationCard, createCard);

router.delete('/:cardId', validationCardId, deleteCard);

router.put('/:cardId/likes', validationCardId, addLike);

router.delete('/:cardId/likes', validationCardId, deleteLike);

module.exports = router;

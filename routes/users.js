const router = require('express').Router();
const {
  validationProfile,
  validationUserId,
  validationAvatar,
} = require('../utils/validation');

const {
  getUsers,
  getUser,
  getMeInfo,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:userId', validationUserId, getUser);

router.get('/me', getMeInfo);

router.patch('/me', validationProfile, updateUser);

router.patch('/me/avatar', validationAvatar, updateAvatar);

module.exports = router;

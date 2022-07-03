const router = require('express').Router();
const {
  getUsers,
  getMeInfo,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  validationProfile,
  validationUserId,
  validationAvatar,
} = require('../utils/validation');

router.get('/', getUsers);

router.get('/me', getMeInfo);

router.get('/:userId', validationUserId, getUser);

router.patch('/me', validationProfile, updateUser);

router.patch('/me/avatar', validationAvatar, updateAvatar);

module.exports = router;

const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateUserAvatarById,
} = require('../controllers/user');

router.patch('/users/me', updateUserById);
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:Id', getUserById);
router.patch('/users/me/avatar', updateUserAvatarById);

module.exports = router;

const router = require('express').Router();
const { signup, login, logout, updatePassword } = require('../controller/auth');
const { requireAuth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.patch('/password', requireAuth, updatePassword);

module.exports = router;

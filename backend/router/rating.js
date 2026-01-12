const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { submitRating } = require('../controller/rating');

router.post('/', requireAuth, submitRating);

module.exports = router;

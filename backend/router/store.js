const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { getStoresWithUserRatings } = require('../controller/rating');
const { listStores } = require('../controller/store');

router.get('/', requireAuth, getStoresWithUserRatings);
router.get('/public', listStores);

module.exports = router;

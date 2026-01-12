const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { getOwnerDashboard } = require('../controller/store');

router.use(requireAuth);
router.use(requireRole('owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;

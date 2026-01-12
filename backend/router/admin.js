const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { createUser, listUsers, getUserById, getDashboardStats } = require('../controller/user');
const { createStore, listStores, getStoreById } = require('../controller/store');

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/dashboard/stats', getDashboardStats);
router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.post('/stores', createStore);
router.get('/stores', listStores);
router.get('/stores/:id', getStoreById);

module.exports = router;

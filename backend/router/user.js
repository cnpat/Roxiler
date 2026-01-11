const router = require('express').Router();

router.post('/create', createUser);
router.get('/get', getUser);
router.post('/login', loginUser);
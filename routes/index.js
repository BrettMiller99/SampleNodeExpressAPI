const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/users', UserController.getUsers);
router.post('/users', UserController.createUser);

module.exports = router;
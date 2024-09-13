// backend/routes/user.route.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;

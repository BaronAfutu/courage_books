const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

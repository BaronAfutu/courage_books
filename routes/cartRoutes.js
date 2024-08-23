const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

router.get('/',cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/delete',cartController.removeFromCart);
router.post('/update',cartController.updateCartQuantity);
router.post('/clear',cartController.clearCart);

module.exports = router;

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

router.get('/',cartController.getCart);
router.post('/', cartController.addToCart);
router.post('/update',cartController.updateCartQuantity);
router.post('/clear',cartController.clearCart);
router.delete('/delete',cartController.removeFromCart);

module.exports = router;

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/WishlistController');

router.get('/',wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.post('/clear',wishlistController.clearWishlist);
router.delete('/delete',wishlistController.removeFromWishlist);

module.exports = router;

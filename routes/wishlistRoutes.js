const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/WishlistController');

router.get('/',wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/delete',wishlistController.removeFromWishlist);
router.post('/clear',wishlistController.clearWishlist);

module.exports = router;

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

router.get('/',orderController.getAllOrders); // For Admins
router.get('/user',orderController.getOrdersByUser);
router.get('/:id',orderController.getOrderById)
router.post('/', orderController.createOrder);
router.post('/:id', orderController.updateOrderStatus);
// router.post('/:reviewId',reviewController.updateReview);
// router.delete('/:bookId/:reviewId/delete',reviewController.deleteReview);

module.exports = router;

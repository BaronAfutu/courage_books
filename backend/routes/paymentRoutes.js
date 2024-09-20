const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');

router.get('/',paymentController.getAllPayments); // Admins Only
router.get('/:id',paymentController.getPaymentById);
router.get('/order/:orderId',paymentController.getPaymentsByOrder);
router.post('/', paymentController.createPayment);
router.post('/:id', paymentController.updatePaymentStatus); // Admins Only
router.delete('/:id',paymentController.deletePayment); // Admins Only

module.exports = router;

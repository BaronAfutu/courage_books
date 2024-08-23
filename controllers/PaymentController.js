const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { order, amount, paymentMethod, paymentStatus } = req.body;

        // Check if the order exists
        const existingOrder = await Order.findById(order);
        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create a new payment record
        const payment = new Payment({
            order,
            amount,
            paymentMethod,
            paymentStatus
        });

        await payment.save();
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        res.status(400).json({ message: 'Error creating payment', error });
    }
};

// Get all payments (Admin only)
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('order', 'user totalPrice');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('order', 'user totalPrice');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error });
    }
};

// Get payments by order ID
exports.getPaymentsByOrder = async (req, res) => {
    try {
        const payments = await Payment.find({ order: req.params.orderId }).populate('order', 'user totalPrice');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.paymentStatus = status;
        await payment.save();

        res.status(200).json({ message: 'Payment status updated', payment });
    } catch (error) {
        res.status(400).json({ message: 'Error updating payment status', error });
    }
};

// Delete a payment by ID (Admin only)
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error });
    }
};

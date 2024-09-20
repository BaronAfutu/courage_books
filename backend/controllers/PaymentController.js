const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const { decodeToken } = require('./GeneralController');
const { PaymentValidation } = require('../helpers/validation');

// TODO Testing Endpoints

// Create a new payment
exports.createPayment = async (req, res) => {
    const { error, value } = PaymentValidation.create.validate(req.body);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });

    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;


        const { order, amount, transactionId, paymentMethod } = value;

        // Check if the order exists
        const existingOrder = await Order.findById(order);
        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if(existingOrder.orderStatus == 'completed' || existingOrder.orderStatus == 'cancelled'){
            return res.status(400).json({message: `Order already ${existingOrder.orderStatus}`})
        }

        // Check if transaction ID already used
        const existingPayment = await Payment.findOne({ transactionId: transactionId });
        if (existingPayment) {
            return res.status(404).json({ message: 'Payment already recorded' });
        }

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Check if the transaction ID exists with paystack, if not, dont proceed
        // Check if the amount quoted to be paid in req.body
        // is the amount actually paid to paystack
        // And is the amount payable to the order
        // while considering discounts and balance
        // If an issue occurs after payment has been confirmed
        // as sent to paystack, add to user balance

        // After all has checked out,
        // payment status will be obtained from paystack response
        const status = 'successful';

        // console.log(...existingOrder.items.map(item=>item.book));

        // Create a new payment record
        const payment = new Payment({
            order,
            paymentMethod,
            transactionId,
            amount,
            status
        });
        await payment.save();
        
        // When a payment is made, the books should be assigned to the user.
        existingUser.books.push(...existingOrder.items.map(item => item.book));
        await existingUser.save();
        
        // Then the order will be marked as completed
        existingOrder.orderStatus = "completed";
        existingOrder.shippingStatus = "delivered";
        await existingOrder.save();

        // Send an email receipt after payment made
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        res.status(400).json({ message: 'Error creating payment', error });
    }
};

// Get all payments (Admin only)
exports.getAllPayments = async (req, res) => {
    try {
        //Getting User Admin Status
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id, isAdmin } = decoded;

        if (!isAdmin) return res.status(401).json({ status: false, message: "Unathorized!!" });

        const payments = await Payment.find().populate('order', 'user totalAmount orderStatus');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('order', 'user totalAmount orderStatus');
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
        const payments = await Payment.find({ order: req.params.orderId }).populate('order', 'user totalAmount orderStatus');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
};

// Update payment status (Admins Only)
exports.updatePaymentStatus = async (req, res) => {
    try {
        //Getting User Admin Status
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id, isAdmin } = decoded;

        if (!isAdmin) return res.status(401).json({ status: false, message: "Unathorized!!" });

        const { status } = req.body;

        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        await payment.save();

        res.status(200).json({ message: 'Payment status updated', payment });
    } catch (error) {
        res.status(400).json({ message: 'Error updating payment status', error });
    }
};

// Delete a payment by ID (Admin only)
exports.deletePayment = async (req, res) => {
    try {
        //Getting User Admin Status
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id, isAdmin } = decoded;

        if (!isAdmin) return res.status(401).json({ status: false, message: "Unathorized!!" });

        const payment = await Payment.findByIdAndUpdate(req.params.id, { status: "cancelled" });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error });
    }
};
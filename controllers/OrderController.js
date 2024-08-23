const Order = require('../models/Order');
const Book = require('../models/Book');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { user, items, shippingAddress, paymentMethod } = req.body;

        // Calculate total price
        let totalPrice = 0;
        for (const item of items) {
            const book = await Book.findById(item.book);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            totalPrice += book.price * item.quantity;
        }

        const order = new Order({
            user,
            items,
            shippingAddress,
            paymentMethod,
            totalPrice,
            orderStatus: 'Pending',
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error });
    }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate('items.book', 'title price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.book', 'title price');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(400).json({ message: 'Error updating order status', error });
    }
};

// Delete an order by ID (Admin only)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};


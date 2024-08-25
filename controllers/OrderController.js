const Order = require('../models/Order');
const Book = require('../models/Book');
const User = require('../models/User');
const { decodeToken } = require('./GeneralController');
const { OrderValidation } = require('../helpers/validation');

// Create a new order
exports.createOrder = async (req, res) => {
    const { error, value } = OrderValidation.create.validate(req.body);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });
    
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const { items, shippingAddress } = value;

        // Calculate total price
        let totalAmount = 0;
        for (const item of items) {
            const book = await Book.findById(item.book);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            totalAmount += book.price * item.quantity;
        }

        const user = await User.findById(userId).select('id');

        const order = new Order({
            user,
            items,
            totalAmount,
            shippingAddress
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Error creating order', error });
    }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        if (!isAdmin) return res.status(401).json({status:false, message:"Unathorized!!"});

        // TODO Add other queries like order status and the likes
        const orders = await Order.find()
        .populate('user', 'id username email')
        .populate('items.book','id title subtitle slug format coverImageUrl');
        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get orders by user ID
exports.getOrdersByUser = async (req, res) => {
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const orders = await Order.find({ user: userId })
        .populate('items.book','id title subtitle slug format coverImageUrl');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate('items.book','id title subtitle slug format coverImageUrl');
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
    const { error, value } = OrderValidation.updateStatus.validate(req.body);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });

    try {

        const {orderStatus='', shippingStatus='', shippingAddress=''} = value;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if(orderStatus!=='' && orderStatus!=null)order.orderStatus = orderStatus;
        if(shippingStatus!=='' && shippingStatus!=null)order.shippingStatus = shippingStatus;
        if(shippingAddress!=='' && shippingAddress!=null)order.shippingAddress = shippingAddress;

        await order.save();

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(400).json({ message: 'Error updating order status', error });
    }
};

// Delete an order by ID (Admin only)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id,{orderStatus:'cancelled'});
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};


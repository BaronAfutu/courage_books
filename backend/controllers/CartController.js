const User = require('../models/User');
const Book = require('../models/Book');
const { decodeToken } = require('./GeneralController');

exports.addToCart = async (req, res) => {

    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const { bookId = '', quantity = 1 } = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });
        if (typeof quantity !== 'number') quantity = 1;


        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const user = await User.findById(userId).populate('cart.book','id title subtitle slug coverImageUrl price discount format');

        const cartItemIndex = user.cart.findIndex(item => item.book.id === bookId);

        if (cartItemIndex > -1) {
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            user.cart.push({ book: bookId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Book added to cart successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book to cart', error });
    }
};

exports.removeFromCart = async (req, res) => {

    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const { bookId = ''} = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });

        const user = await User.findById(userId).populate('cart.book','id title subtitle slug coverImageUrl price discount format');

        const cartItemIndex = user.cart.findIndex(item => item.book.id === bookId);

        if (cartItemIndex > -1) {
            user.cart.splice(cartItemIndex, 1);
            await user.save();
            res.status(200).json({ message: 'Book removed from cart successfully', cart: user.cart });
        } else {
            res.status(404).json({ message: 'Book not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing book from cart', error });
    }
};

exports.updateCartQuantity = async (req, res) => {
    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const { bookId = '', quantity = 1 } = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });
        if (typeof quantity !== 'number') quantity = 1;
        

        const user = await User.findById(userId).populate('cart.book','id title subtitle slug coverImageUrl price discount format');

        const cartItemIndex = user.cart.findIndex(item => item.book.id === bookId);

        if (cartItemIndex > -1) {
            if (quantity <= 0) {
                user.cart.splice(cartItemIndex, 1);
            } else {
                user.cart[cartItemIndex].quantity = quantity;
            }
            await user.save();
            res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
        } else {
            res.status(404).json({ message: 'Book not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error });
    }
};

exports.getCart = async (req, res) => {
    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const user = await User.findById(userId).populate('cart.book','id title subtitle slug coverImageUrl price discount format');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const user = await User.findById(userId);
        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error });
    }
};

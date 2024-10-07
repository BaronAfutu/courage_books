const User = require('../models/User');
const Book = require('../models/Book');
const { decodeToken } = require('./GeneralController');


exports.addToWishlist = async (req, res) => {
    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const { bookId = ''} = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const user = await User.findById(userId);

        if (user.wishlist.includes(bookId)) {
            return res.status(400).json({ message: 'Book already in wishlist' });
        }

        user.wishlist.push(bookId);
        await user.save();
        res.status(200).json({ message: 'Book added to wishlist successfully', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book to wishlist', error });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const { bookId = ''} = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });

        const user = await User.findById(userId);

        const wishlistIndex = user.wishlist.indexOf(bookId);

        if (wishlistIndex > -1) {
            user.wishlist.splice(wishlistIndex, 1);
            await user.save();
            res.status(200).json({ message: 'Book removed from wishlist successfully', wishlist: user.wishlist });
        } else {
            res.status(404).json({ message: 'Book not found in wishlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing book from wishlist', error });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const user = await User.findById(userId).populate('wishlist','id title subtitle price slug coverImageUrl');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving wishlist', error });
    }
};

exports.clearWishlist = async (req, res) => {
    try {
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const user = await User.findById(userId);
        user.wishlist = [];
        await user.save();

        res.status(200).json({ message: 'Wishlist cleared successfully', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing wishlist', error });
    }
};

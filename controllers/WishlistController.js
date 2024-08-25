const User = require('../models/User');
const Book = require('../models/Book');
const { decodeToken } = require('./GeneralController');

/*
Recommendations:
Authentication Middleware: Ensure that routes using these controllers are protected by authentication middleware to prevent unauthorized access to a user's wishlist.
Validation: Implement input validation to ensure that the book ID is a valid MongoDB ObjectId.
Error Handling: Expand error handling to cover more specific scenarios, such as database connection errors or validation failures.
Wishlist Limitations: Depending on the use case, consider setting a maximum number of items that can be added to the wishlist.
This wishlistController will allow users to manage their wishlist by adding and removing books and viewing or clearing the entire list. It provides the basic functionality required for a wishlist feature in an e-commerce platform.
*/

// Add a book to the wishlist
exports.addToWishlist = async (req, res) => {
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        // Getting Book ID
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

// Remove a book from the wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        // Getting Book ID
        const { bookId = ''} = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });

        const user = await User.findById(userId);

        const wishlistIndex = user.wishlist.indexOf(bookId);

        if (wishlistIndex > -1) {
            // Remove the book from the wishlist
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

// Get the user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        //Getting User ID
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

// Clear the wishlist
exports.clearWishlist = async (req, res) => {
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const user = await User.findById(userId);
        user.wishlist = []; // Clear the wishlist
        await user.save();

        res.status(200).json({ message: 'Wishlist cleared successfully', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing wishlist', error });
    }
};

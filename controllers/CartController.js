const User = require('../models/User');
const Book = require('../models/Book');
const { decodeToken } = require('./GeneralController');

/*
Recommendations:
Authentication Middleware: Ensure that routes calling these controllers are protected by authentication middleware to guarantee that only authenticated users can manage their carts.
Validation: Implement input validation to check that quantities are positive integers and that the book ID is a valid MongoDB ObjectId.
Error Handling: Expand error handling to distinguish between different types of errors, such as validation errors, database connection errors, etc.
*/

// Add a book to the cart
exports.addToCart = async (req, res) => {

    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        // Getting Book ID
        const { bookId = '', quantity = 1 } = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });
        if (typeof quantity !== 'number') quantity = 1;


        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const user = await User.findById(userId);

        const cartItemIndex = user.cart.findIndex(item => item.book.toString() === bookId);

        if (cartItemIndex > -1) {
            // If book already exists in the cart, update the quantity
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            // If book does not exist in the cart, add a new cart item
            user.cart.push({ book: bookId, quantity });
        }

        await user.save();
        res.status(200).json({ message: 'Book added to cart successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book to cart', error });
    }
};

// Remove a book from the cart
exports.removeFromCart = async (req, res) => {

    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        // Getting Book ID
        const { bookId = ''} = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });

        const user = await User.findById(userId);

        const cartItemIndex = user.cart.findIndex(item => item.book.toString() === bookId);

        if (cartItemIndex > -1) {
            // Remove the book from the cart
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

// Update the quantity of a book in the cart
exports.updateCartQuantity = async (req, res) => {
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        // Getting Book ID
        const { bookId = '', quantity = 1 } = req.body;
        if (typeof bookId !== 'string') return res.status(400).json({ status: false, errMsg: "bookid should be a string!!" });
        if (typeof quantity !== 'number') quantity = 1;
        

        const user = await User.findById(userId);

        const cartItemIndex = user.cart.findIndex(item => item.book.toString() === bookId);

        if (cartItemIndex > -1) {
            if (quantity <= 0) {
                // Remove the book if the quantity is set to 0 or less
                user.cart.splice(cartItemIndex, 1);
            } else {
                // Update the quantity of the book in the cart
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

// Get the user's cart
exports.getCart = async (req, res) => {
    try {
        //Getting User ID
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

// Clear the cart
exports.clearCart = async (req, res) => {
    try {
        //Getting User ID
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id: userId, isAdmin } = decoded;

        const user = await User.findById(userId);
        user.cart = []; // Clear the cart
        await user.save();

        res.status(200).json({ message: 'Cart cleared successfully', cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error });
    }
};

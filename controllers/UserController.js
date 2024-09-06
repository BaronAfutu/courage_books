const User = require('../models/User');
const { decodeToken } = require('./GeneralController');
const { UserValidation } = require('../helpers/validation');

// Fetch all users (Admins Only)
const getAllUsers = async (req, res) => {
    try {
        //Getting User Admin Status
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id, isAdmin } = decoded;

        if (!isAdmin) return res.status(401).json({ status: false, message: "Unathorized!!" });

        const users = await User.find().select('-password -cart -wishlist')
        .populate('books','id slug title subtitle rating.averageRating');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Fetch a single user by ID (Admin and User himself only)
const getUserById = async (req, res) => {
    try {
        //Getting UserId and Admin Status
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id:userId, isAdmin } = decoded;

        if (!isAdmin && userId!=req.params.id) return res.status(401).json({ status: false, message: "Unathorized!!" });

        const user = await User.findById(req.params.id).select('-password')
        .populate('books')
        .populate('books','id slug title subtitle rating.averageRating')
        .populate('cart.book','id slug title subtitle rating.averageRating')
        .populate('wishlist','id slug title subtitle rating.averageRating');

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing user (Admin and User himself only)
const updateUser = async (req, res) => {
    const { error, value } = UserValidation.update.validate(req.body);
    if (error) return res.status(400).json({ status: false, errMsg: error.details[0].message });

    try {
        //Getting UserId and Admin Status
        const decoded = await decodeToken(req.headers.authorization);
        if (!decoded.success) return res.status(500).json({ status: false });
        const { id:userId, isAdmin } = decoded;

        if (!isAdmin && userId!==req.params.id) return res.status(401).json({ status: false, message: "Unathorized!!" });

        const user = await User.findByIdAndUpdate(req.params.id,value);
        if (!user) return res.status(404).json({ message: "User not found" });

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,{status:0});
        if (!user) return res.status(404).json({ message: "User not found" });

        // await user.remove();
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};

const UserModel = require('../models/User');
const { dataValidation, dataFiltersValidation, getDataValidation } = require('../helpers/validation');

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Fetch a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).populate('books').populate('cart.book','id title').populate('wishlist');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing user
const updateUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.remove();
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

const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ name, email, passwordHash: password }); // You should hash the password before saving
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};
// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash'); // Exclude passwordHash from the response
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};


// Fetch user details
const getUserDetails = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
};

// Update user details
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body; // Use only the fields you want to update

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally, handle password update (hashing before saving)
        if (updates.password) {
            updates.passwordHash = updates.password; // You should hash this before saving
            delete updates.password; // Remove plaintext password before saving
        }

        Object.assign(user, updates); // Update user fields with new values
        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = {
    registerUser,
    getUserDetails,
    updateUser,
    deleteUser,
    getAllUsers,
};

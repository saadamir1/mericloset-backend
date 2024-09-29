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

module.exports = {
    registerUser,
    getUserDetails
};

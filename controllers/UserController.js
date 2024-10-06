const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Extract username from email
        const username = email.split('@')[0]; // Get the part before '@'
        const passwordHash = bcrypt.hashSync(password, 10);

        // Create a new User instance with firstName and lastName
        const newUser = new User({ firstName, lastName, email, passwordHash, username });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User does not exist' });
        }

        // Compare the password with the hashed password
        const isMatch = bcrypt.compareSync(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate a JWT token after confirming the password
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', user: { firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email }, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
};



// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); //for long user list, we can display only specific fields i.e name and email 
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

        //handle password update
        if (updates.password) {
            updates.passwordHash = bcrypt.hashSync(updates.password, 10); //hash this before saving
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
    loginUser,
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Brand = require('../models/Brand');

const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key"; // Use env variable for security

// **Register User**
const registerUser = async (req, res) => {
    try {
        console.log("Registering user...");
        console.log(req.body);
        const { firstName, lastName, email, password } = req.body;

        // Check if email already exists under 'user' role
        const existingUser = await User.findOne({ email, role: 'user' });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered as a user." });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create an empty profile with only firstName and lastName
        const profile = await Profile.create({
            firstName,
            lastName,
            gender: "",
            age: null,
            measurements: { height: null, weight: null, chest: null, waist: null },
            preferences: { style: "", sustainability: false, size: "", color: "", favoriteBrands: [], fitPreference: "" }
        });

        // Create the user and link it to the profile
        const user = await User.create({
            username: email.split('@')[0], // Extract username from email
            email,
            passwordHash,
            role: 'user',
            userProfile: profile._id // Link profile to user
        });
        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '7d' });

        res.status(201).json({ message: "User registered successfully", token, user });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

const slugify = async (text, Brand) => {
    const baseSlug = text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/^-+/, '') // Trim hyphen from start of text
        .replace(/-+$/, ''); // Trim hyphen from end of text

    let slug = baseSlug;
    let count = 1;

    // Check for existing slugs and modify if necessary
    while (await Brand.findOne({ slug })) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
};

const registerBrand = async (req, res) => {
    try {
        console.log("Registering brand...");
        console.log(req.body);

        // Destructure the correct fields from the request body
        const { brandName, email, password, description, website, logoUrl } = req.body;
        const name = brandName; // frontend sends 'brandName' instead of 'name'

        // Check if email already exists under 'brand' role
        const existingBrand = await User.findOne({ email, role: 'brand' });
        if (existingBrand) {
            return res.status(400).json({ message: "Email already registered as a brand." });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate unique slug from brand name
        const slug = await slugify(name, Brand);

        // Create an empty brand profile
        const brandProfile = await Brand.create({
            name, // Use 'name' from the request body
            description, // Use the description from the request body
            website, // Use the website from the request body
            logoUrl: logoUrl, // Use the logoUrl from the request body
            socialLinks: [],
            categories: [],
            sustainabilityFocus: false,
            slug: slug
        });

        // Create the brand user and link to profile
        const brandUser = await User.create({
            username: email.split('@')[0], // Extract username from email
            email,
            passwordHash,
            role: 'brand',
            brandProfile: brandProfile._id
        });

        // Generate JWT Token
        const token = jwt.sign({ userId: brandUser._id, role: brandUser.role }, SECRET_KEY, { expiresIn: '7d' });

        res.status(201).json({ message: "Brand registered successfully", token, brandUser });
    } catch (error) {
        console.error("Brand Registration Error:", error);
        res.status(500).json({ message: "Brand registration failed", error: error.message });
    }
};

// **Login (For both User & Brand)**
const login = async (req, res) => {
    try {
        const { loginIdentifier, password, isSeller = false } = req.body; // loginIdentifier = email or username || default login type: user
        const role = isSeller ? 'brand' : 'user';

        // Find user by email or username and role
        const user = await User.findOne({
            $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
            role
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '7d' });

        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

// **Update User/Brand Profile**
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, profileData, brandData } = req.body;

        let updatedUser;
        if (role === 'user') {
            updatedUser = await User.findByIdAndUpdate(userId, { $set: { userProfile: profileData } }, { new: true });
        } else if (role === 'brand') {
            updatedUser = await User.findByIdAndUpdate(userId, { $set: { brandProfile: brandData } }, { new: true });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Profile update failed", error: error.message });
    }
};

// **Delete User/Brand**
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete associated profile/brand profile
        if (user.role === 'user' && user.userProfile) {
            await Profile.findByIdAndDelete(user.userProfile);
        }
        if (user.role === 'brand' && user.brandProfile) {
            await Brand.findByIdAndDelete(user.brandProfile);
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "User deletion failed", error: error.message });
    }
};

// **Get All Users**
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('userProfile brandProfile');
        res.status(200).json(users);
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

// **Get User Details**
const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('userProfile brandProfile');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Get User Details Error:", error);
        res.status(500).json({ message: "Failed to fetch user details", error: error.message });
    }
};

module.exports = {
    registerUser,
    registerBrand,
    login,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserDetails
};

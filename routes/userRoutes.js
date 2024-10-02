const express = require('express');
const {
    registerUser,
    getUserDetails,
    updateUser,
    getAllUsers,
    deleteUser,
} = require('../controllers/UserController');

const router = express.Router();

// User routes
router.post('/', registerUser); // Register user
router.get('/', getAllUsers); //get all users list
router.get('/:userId', getUserDetails); // Get user details
router.put('/:userId', updateUser); // Update user
router.delete('/:userId', deleteUser); // Delete user

module.exports = router;
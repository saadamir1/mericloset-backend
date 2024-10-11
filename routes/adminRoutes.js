const express = require('express');
const {
    createBrandAdmin,
    deleteBrandAdmin,
    uploadProductSheet,
    getAllUsersAdmin,
    deleteUserAdmin,
} = require('../controllers/AdminController');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'upload/' });

// Admin routes
router.post('/brands', createBrandAdmin); // Admin create a new brand
router.delete('/brands/:brandId', deleteBrandAdmin); // Admin delete brand
router.post('/upload', upload.single('file'), uploadProductSheet);  // Admin upload product sheet
router.get('/users', getAllUsersAdmin); // Admin get all users
router.delete('/users/:userId', deleteUserAdmin); // Admin delete user

// Add more admin routes as needed

module.exports = router;

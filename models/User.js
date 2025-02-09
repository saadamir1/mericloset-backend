const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'brand'], required: true },
    userProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: function () { return this.role === 'user'; } // Profile is required if user
    },
    brandProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: function () { return this.role === 'brand'; } // Brand is required if seller
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Virtual field for ID
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure (username, role) is unique together
userSchema.index({ username: 1, role: 1 }, { unique: true });

// Ensure (email, role) is unique together
userSchema.index({ email: 1, role: 1 }, { unique: true });



userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);
module.exports = User;

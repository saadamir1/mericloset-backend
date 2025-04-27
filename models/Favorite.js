const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
}, { timestamps: true });

// Fix OverwriteModelError
module.exports = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

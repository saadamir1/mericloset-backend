const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);

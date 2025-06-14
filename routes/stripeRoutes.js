const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { product, items } = req.body;

    // Decide whether to use single item or multiple items
    let line_items = [];

    if (product) {
      // Single product (Buy Now)
      if (!product.title || !product.image || !product.price || !product.quantity) {
        return res.status(400).json({ error: "Invalid product data" });
      }

      line_items.push({
        price_data: {
          currency: "pkr",
          product_data: {
            name: product.title,
            images: [product.image],
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
        quantity: product.quantity,
      });

    } else if (Array.isArray(items) && items.length > 0) {
      // Multiple products (Wishlist Checkout)
      line_items = items.map(item => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: item.title,
            images: [item.image],
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity || 1,
      }));
    } else {
      return res.status(400).json({ error: "No valid data provided for checkout" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/checkout",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Stripe session creation failed", details: error.message });
  }
});

module.exports = router;
const Product = require('../models/Product');
const Favorite = require('../models/Favorite');

const processImages = (imageData) => {
  if (typeof imageData === 'string') {
    return imageData
      .replace(/'/g, '')
      .split(',')
      .map((url) => url.trim());
  }
  return imageData;
};

// Content-Based Recommendations Helper
const getContentBasedRecommendations = async (product) => {
  const similarProducts = await Product.find({
    _id: { $ne: product._id },
    brand: product.brand,
    category: product.category
  }).limit(10);

  return similarProducts;
};


// CREATE
const createProduct = async (req, res) => {
  let productData = req.body;
  if (productData.images) productData.images = processImages(productData.images);

  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// GET ALL (with brand prioritization and no pagination if brandID is passed)
const getAllProducts = async (req, res) => {
  const {
    categoryID,
    brandID,
    ordering: sortOrder,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 36,
  } = req.query;

  const skip = (page - 1) * limit;
  let filter = {};
  let sort = {};

  if (categoryID) filter.category = categoryID;
  if (brandID) filter.brand = brandID;

  if (search) {
    const searchRegex = new RegExp(search.split(/\s+/).join('|'), 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { brand: searchRegex },
      { tags: searchRegex },
    ];
  }

  if (minPrice && maxPrice) filter.price = { $gte: minPrice, $lte: maxPrice };
  else if (minPrice) filter.price = { $gte: minPrice };
  else if (maxPrice) filter.price = { $lte: maxPrice };

  switch (sortOrder) {
    case "name": sort = { name: 1 }; break;
    case "-name": sort = { name: -1 }; break;
    case "price": sort = { price: 1 }; break;
    case "-price": sort = { price: -1 }; break;
    case "-added": sort = { createdAt: -1 }; break;
    case "-rating": sort = { rating: -1 }; break;
    case "-metacritic": sort = { popularity: -1 }; break;
    default: sort = {};
  }

  try {
    // 🔥 Return all brand products sorted by newest if brandID is given
    if (brandID) {
      const brandProducts = await Product.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ results: brandProducts });
    }

    // Default paginated results
    const totalCount = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    return res.status(200).json({
      count: totalCount,
      next: totalCount > page * limit ? `/api/v1/products?page=${+page + 1}&limit=${limit}` : null,
      results: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// GET BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  let updateData = req.body;
  if (updateData.images) updateData.images = processImages(updateData.images);

  try {
    const updated = await Product.findByIdAndUpdate(req.params.productId, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.productId);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};

const getHybridRecommendations = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`Generating recommendations for: ${product.title} [${product.category}]`);

    // 1. CATEGORY-AWARE COLLABORATIVE FILTERING (Weight: 1.5 - Further reduced)
    const favorites = await Favorite.find({ product: productId });
    const userIds = favorites.map(fav => fav.user);

    let collaborativeProducts = [];
    if (userIds.length > 0) {
      const otherFavorites = await Favorite.find({
        user: { $in: userIds },
        product: { $ne: productId }
      }).populate('product');

      let categoryAwareProductCount = {};

      otherFavorites.forEach(fav => {
        if (fav.product) {
          const pid = fav.product._id.toString();
          // Give extra weight to products in the same category
          if (fav.product.category === product.category) {
            categoryAwareProductCount[pid] = (categoryAwareProductCount[pid] || 0) + 3;
          } else {
            categoryAwareProductCount[pid] = (categoryAwareProductCount[pid] || 0) + 1;
          }
        }
      });

      const sortedCollaborativeIds = Object.keys(categoryAwareProductCount)
        .sort((a, b) => categoryAwareProductCount[b] - categoryAwareProductCount[a])
        .slice(0, 4);

      collaborativeProducts = await Product.find({ _id: { $in: sortedCollaborativeIds } });
    }

    // 2. CONTENT-BASED FILTERING - ENHANCED AND DIVERSIFIED
    const [sameBrandCategory, sameCategoryDiffBrand, similarPriceProducts, sameBrandDiffCategory, popularInCategory, randomSameCategory] = await Promise.all([
      // 2a. Same category + same brand (Weight: 3 - Highest for direct relevance)
      Product.find({
        _id: { $ne: product._id },
        brand: product.brand,
        category: product.category
      }).limit(6),

      // 2b. Same category + different brand (Weight: 3 - Equal importance)
      Product.find({
        _id: { $ne: product._id },
        category: product.category,
        brand: { $ne: product.brand }
      }).limit(8),

      // 2c. Similar price range + same category (Weight: 2)
      Product.find({
        _id: { $ne: product._id },
        category: product.category,
        price: {
          $gte: product.price - (product.price * 0.4),
          $lte: product.price + (product.price * 0.4)
        }
      }).limit(6),

      // 2d. Same brand + different category (Weight: 1)
      Product.find({
        _id: { $ne: product._id },
        brand: product.brand,
        category: { $ne: product.category }
      }).limit(4),

      // 2e. Popular products in same category (Weight: 1)
      Product.find({
        _id: { $ne: product._id },
        category: product.category,
        popularityIndex: { $gte: 5 }
      }).sort({ popularityIndex: -1 }).limit(4),

      // 2f. Random products from same category for serendipity (Weight: 0.5)
      Product.aggregate([
        { $match: { _id: { $ne: product._id }, category: product.category } },
        { $sample: { size: 5 } }
      ])
    ]);

    // 3. ENHANCED HYBRID SCORING WITH BETTER WEIGHTS
    const scores = new Map();

    // Helper function to add score with diminishing returns for same products
    const addScore = (productArray, weight) => {
      productArray.forEach((p, index) => {
        const productId = p._id.toString();
        const currentScore = scores.get(productId) || 0;
        const positionPenalty = Math.max(0.3, 1 - (index * 0.1));
        const finalWeight = weight * positionPenalty;

        scores.set(productId, currentScore + finalWeight);

        // Add small bonus for category relevance if it matches exactly
        if (p.category === product.category) {
          scores.set(productId, scores.get(productId) + 0.5);
        }
      });
    };

    // Apply scoring with category-prioritized weights
    addScore(sameBrandCategory, 4);
    addScore(sameCategoryDiffBrand, 4);
    addScore(similarPriceProducts, 3);
    addScore(collaborativeProducts, 1.5);
    addScore(sameBrandDiffCategory, 0.5);
    addScore(popularInCategory, 2);
    addScore(randomSameCategory, 1);

    // 4. ENHANCED DIVERSITY BOOST WITH CATEGORY RELEVANCE
    const allProducts = [...sameBrandCategory, ...sameCategoryDiffBrand, ...similarPriceProducts,
    ...collaborativeProducts, ...sameBrandDiffCategory, ...popularInCategory, ...randomSameCategory];

    scores.forEach((score, productId) => {
      const productData = allProducts.find(p => p._id.toString() === productId);

      if (productData) {
        // Give significant boost to same category products
        if (productData.category === product.category) {
          scores.set(productId, score + 2);
        }

        // Reduce score for products that are too popular across all categories
        if (productData.popularityIndex && productData.popularityIndex > 8) {
          scores.set(productId, score * 0.8);
        }
      }

      // Larger random factor for more variety
      scores.set(productId, scores.get(productId) + Math.random() * 0.5);
    });

    // 5. FINAL SORTING AND SELECTION
    const sortedIds = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 30);

    const candidateProducts = await Product.find({ _id: { $in: sortedIds } });

    const axios = require("axios");

    // IMPROVED IMAGE VALIDATION FUNCTION
    const hasValidImages = async (imageUrls) => {
      if (!imageUrls || imageUrls.length === 0) return false;

      for (let i = 0; i < Math.min(imageUrls.length, 3); i += 3) {
        const batch = imageUrls.slice(i, i + 3);

        const batchPromises = batch.map(async (url) => {
          try {
            const cleanUrl = url.trim();
            if (!cleanUrl.startsWith('http')) return false;

            const response = await axios.head(cleanUrl, {
              timeout: 8000,
              maxRedirects: 3,
              validateStatus: (status) => status === 200,
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
            });

            const contentType = response.headers['content-type'];
            return contentType && contentType.startsWith('image/');
          } catch (error) {
            return false;
          }
        });

        const results = await Promise.all(batchPromises);
        if (results.some(result => result)) return true;
      }
      return false;
    };

    // Filter products with valid images
    const imageValidationPromises = candidateProducts.map(async (prod) => {
      const hasValid = await hasValidImages(prod.images);
      return { product: prod, hasValidImages: hasValid };
    });

    const validationResults = await Promise.all(imageValidationPromises);
    const validProducts = validationResults
      .filter(result => result.hasValidImages)
      .map(result => result.product);

    console.log(`Image validation: ${validProducts.length}/${candidateProducts.length} products have valid images`);

    if (validProducts.length === 0) {
      console.warn("No valid images found. Using fallback products.");
      const fallbackProducts = candidateProducts.slice(0, 12);
      return res.status(200).json(fallbackProducts.map(prod => ({
        _id: prod._id, title: prod.title, price: prod.price, images: prod.images,
        slug: prod.slug, brand: prod.brand, category: prod.category, imageValidation: false
      })));
    }

    // 6. ENHANCED DIVERSITY CHECK WITH ANTI-DOMINANCE
    const diversifiedProducts = [];
    const brandCount = {};
    const categoryCount = {};

    // Sort validProducts by their scores first
    const validProductsWithScores = validProducts
      .map(p => ({ product: p, score: scores.get(p._id.toString()) || 0 }))
      .sort((a, b) => b.score - a.score);

    // Apply diversification rules
    for (const { product: prod } of validProductsWithScores) {
      const brandKey = prod.brand;
      const categoryKey = prod.category;

      brandCount[brandKey] = brandCount[brandKey] || 0;
      categoryCount[categoryKey] = categoryCount[categoryKey] || 0;

      const isSameCategory = prod.category === product.category;
      const maxSameCategory = 9;
      const maxPerBrand = 3;

      const shouldAdd = (
        brandCount[brandKey] < maxPerBrand &&
        (isSameCategory ? categoryCount[categoryKey] < maxSameCategory : categoryCount[categoryKey] < 3)
      );

      if (shouldAdd) {
        diversifiedProducts.push(prod);
        brandCount[brandKey]++;
        categoryCount[categoryKey]++;
      }

      if (diversifiedProducts.length >= 12) break;
    }

    // Fill remaining slots if needed
    if (diversifiedProducts.length < 12) {
      const remainingProducts = validProducts.filter(p =>
        !diversifiedProducts.some(dp => dp._id.toString() === p._id.toString())
      );
      diversifiedProducts.push(...remainingProducts.slice(0, 12 - diversifiedProducts.length));
    }

    // Simple shuffle without complex category separation
    const finalProducts = [...diversifiedProducts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

    const cleanedProducts = finalProducts.map(prod => ({
      _id: prod._id,
      title: prod.title,
      price: prod.price,
      images: prod.images,
      slug: prod.slug,
      brand: prod.brand,
      category: prod.category,
      imageValidation: true
    }));

    console.log(`SUCCESS: Returning ${cleanedProducts.length} recommendations`);
    res.status(200).json(cleanedProducts);

  } catch (error) {
    console.error('Error in hybrid recommendations:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getHybridRecommendations,
};

const Product = require('../models/Product');
const Favorite = require('../models/favorite'); 

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

    const favorites = await Favorite.find({ product: productId });
    const userIds = favorites.map(fav => fav.user);

    let collaborativeProducts = [];
    if (userIds.length > 0) {
      const otherFavorites = await Favorite.find({
        user: { $in: userIds },
        product: { $ne: productId }
      });

      let productCount = {};
      otherFavorites.forEach(fav => {
        const pid = fav.product.toString();
        productCount[pid] = (productCount[pid] || 0) + 1;
      });

      const sortedCollaborativeIds = Object.keys(productCount).sort((a, b) => productCount[b] - productCount[a]);
      collaborativeProducts = await Product.find({ _id: { $in: sortedCollaborativeIds.slice(0, 10) } });
    }

    const contentBasedProducts = await Product.find({
      _id: { $ne: product._id },
      brand: product.brand,
      category: product.category
    }).limit(10);

    const scores = new Map();

    for (const p of collaborativeProducts) {
      scores.set(p._id.toString(), (scores.get(p._id.toString()) || 0) + 2);
    }

    for (const p of contentBasedProducts) {
      scores.set(p._id.toString(), (scores.get(p._id.toString()) || 0) + 1);
    }

    const sortedIds = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const finalProducts = await Product.find({ _id: { $in: sortedIds.slice(0, 5) } });

    
    const cleanedProducts = finalProducts.map(prod => ({
      _id: prod._id,
      title: prod.title,
      price: prod.price,
      images: prod.images,
      slug: prod.slug,   
    }));

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

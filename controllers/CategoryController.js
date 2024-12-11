const Category = require('../models/Category');

// Controller functions

// Recursive function to structure categories into hierarchy
const buildCategoryHierarchy = async (categories) => {
    // Create a map of categories by their ID
    const categoryMap = categories.reduce((acc, category) => {
        acc[category._id] = category;
        return acc;
    }, {});

    // Add subcategories to their parent categories
    const hierarchy = categories.filter((category) => {
        if (category.parentCategory) {
            const parent = categoryMap[category.parentCategory];
            if (parent) {
                parent.subcategories = parent.subcategories || [];
                parent.subcategories.push(category);
                return false; // Don't include the category at the top level
            }
        }
        return true; // Keep top-level categories
    });

    return hierarchy;
};

const getAllCategories = async (req, res) => {
    try {
        // Fetch categories and populate subcategories recursively
        const categories = await Category.find().populate({
            path: 'subcategories',
            model: Category,
            populate: {
                path: 'subcategories',  // Nested subcategories
                model: Category,
                populate: {
                    path: 'subcategories',
                    model: Category
                }
            }
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};


const createCategory = async (req, res) => {
    const { name, parentCategory, subcategories } = req.body;

    try {
        // Create the new category
        const newCategory = new Category({
            name,
            parentCategory,
            subcategories
        });

        await newCategory.save();

        // If there's a parent category, update it with the new subcategory ID
        if (parentCategory) {
            await Category.findByIdAndUpdate(parentCategory, {
                $push: { subcategories: newCategory._id }
            });
        }

        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category' });
    }
};

const getCategoryById = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Error fetching category' });
    }
};

const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const updateData = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating category' });
    }
};

const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // If there are any parent categories, remove the deleted category from their subcategories
        if (deletedCategory.parentCategory) {
            await Category.findByIdAndUpdate(deletedCategory.parentCategory, {
                $pull: { subcategories: deletedCategory._id }
            });
        }

        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category' });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};

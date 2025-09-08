
const Category = require('../MongoDb/models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCategory = new Category({
      name,
      description
    });

    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category", details: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories", details: err.message });
  }
};

//Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    await Category .deleteOne ({ _id: categoryId });
    res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (err) {
    res.status(500).json({ error: "Failed to delete category", details: err.message });
    }
};
// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();
    res.status(200).json({ message: "Category updated successfully", category });
  }
  catch (err) {
    res.status(500).json({ error: "Failed to update category", details: err.message });
  }
};

 // Get a category by ID
 exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category", details: err.message });
  }
 };
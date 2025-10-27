// Ena Debnath
const Food = require("../models/foodModel");

/**
 * GET /food/management
 * Display all food items for staff management
 */
async function getAllFoods(req, res) {
  try {
    const foods = await Food.find().sort({ name: 1 });
    res.render("foodManagement", { foods });
  } catch (err) {
    console.error("Error loading food items:", err);
    res.status(500).send("Error loading food items");
  }
}

/**
 * POST /food/management/create
 * Create a new food item
 */
async function createFood(req, res) {
  try {
    const { name, category, price, description, status, stock, vegan, image } = req.body;
    
    await Food.create({
      name,
      category,
      price: Number(price),
      description,
      status: status || "Available",
      stock: Number(stock) || 0,
      vegan: vegan === "true" || vegan === true,
      image: image || ""
    });
    
    res.redirect("/food/management");
  } catch (err) {
    console.error("Error creating food item:", err);
    res.status(500).send("Error creating food item");
  }
}

/**
 * POST /food/management/update
 * Update an existing food item
 */
async function updateFood(req, res) {
  try {
    const { id, name, category, price, description, status, stock, vegan, image } = req.body;
    
    await Food.findByIdAndUpdate(id, {
      name,
      category,
      price: Number(price),
      description,
      status,
      stock: Number(stock),
      vegan: vegan === "true" || vegan === true,
      image: image || ""
    });
    
    res.redirect("/food/management");
  } catch (err) {
    console.error("Error updating food item:", err);
    res.status(500).send("Error updating food item");
  }
}

/**
 * POST /food/management/delete/:id
 * Delete a food item
 */
async function deleteFood(req, res) {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect("/food/management");
  } catch (err) {
    console.error("Error deleting food item:", err);
    res.status(500).send("Error deleting food item");
  }
}

module.exports = {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood
};
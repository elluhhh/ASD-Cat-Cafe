// Jiyun Choi

const Food = require("../models/foodModel");

async function getMenu(req, res) {
  try {
    // Show only items that are available and have stock left
    const menu = await Food.find(
      { status: "Available", stock: { $gt: 0 } },
      { name: 1, category: 1, price: 1, description: 1, vegan: 1, image: 1, stock: 1 }
    ).lean();

    // Change _id to id for the frontend
    const menuWithIds = menu.map(item => ({
      ...item,
      id: item._id.toString()
    }));

    res.json(menuWithIds);
  } catch (err) {
    // Log error and send response if loading fails
    console.error("Failed to fetch menu from database:", err);
    res.status(500).json({ error: "Could not load menu" });
  }
}

module.exports = { getMenu };

const Food = require("../models/foodModel");

async function getMenu(req, res) {
  try {
    // Only show available items to customers
    const menu = await Food.find({ status: "Available" }).lean();

    // Transform _id to id for frontend compatibility
    const menuWithIds = menu.map(item => ({
      ...item,
      id: item._id.toString()
    }));

    res.json(menuWithIds);
  } catch (err) {
    console.error("Failed to fetch menu from database:", err);
    res.status(500).json({ error: "Could not load menu" });
  }
}

module.exports = { getMenu };

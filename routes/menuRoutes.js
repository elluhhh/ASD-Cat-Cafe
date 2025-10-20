const express = require("express");
const Food = require("../models/foodModel");
const router = express.Router();

/**
 * GET /api/menu
 * Returns menu items from database for the food ordering page
 */
router.get("/", async (req, res) => {
  try {
    // Only show available items
    const menu = await Food.find({ status: "Available" }).lean();
    
    // Transform _id to id for frontend compatibility
    const list = menu.map(m => ({ 
      ...m, 
      id: String(m._id) 
    }));
    
    res.json(list);
  } catch (e) {
    console.error("Error loading menu:", e);
    res.status(500).json({ error: "Failed to load menu" });
  }
});

module.exports = router;

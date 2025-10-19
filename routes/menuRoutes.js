const express = require("express");
const Food = require("../models/foodModel");
const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const menu = await Food.find().lean();
    const list = menu.map(m => ({ ...m, id: String(m._id) }));
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load menu" });
  }
});

module.exports = router;

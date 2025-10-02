const express = require("express");
const {
    getFoods,
    seedFoods,
    addFood,
    updateFood,
    deleteFood,
    getFoodsAPI
} = require("../controllers/foodController.js");

const router = express.Router();

// View routes
router.get("/", getFoods);
router.get("/seed", seedFoods);

// CRUD routes
router.post("/add", addFood);
router.post("/update/:id", updateFood);
router.post("/delete/:id", deleteFood);

// API route for testing
router.get("/api", getFoodsAPI);

module.exports = router;
// Ena Debnath
const express = require("express");
const router = express.Router();
const foodMgmtController = require("../controllers/foodManagementController");

// All routes here are prefixed with /food/management from server.js
router.get("/", foodMgmtController.getAllFoods); // GET /food/management
router.post("/create", foodMgmtController.createFood); // POST /food/management/create
router.post("/update", foodMgmtController.updateFood); // POST /food/management/update
router.post("/delete/:id", foodMgmtController.deleteFood); // POST /food/management/delete/:id

module.exports = router;
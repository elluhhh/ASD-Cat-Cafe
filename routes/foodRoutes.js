const express = require("express");
const {
    getFoods,
    seedFoods
} = require("../controllers/foodController.js");

const router = express.Router();

router.get("/", getFoods);
router.get("/seed", seedFoods);

module.exports = router;
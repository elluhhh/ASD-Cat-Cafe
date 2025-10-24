const express = require("express");
const { getMenu } = require("../controllers/foodController");
const router = express.Router();

router.get("/", getMenu);

module.exports = router;

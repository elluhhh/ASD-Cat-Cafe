const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.create);
router.get("/:id", orderController.getOne);

module.exports = router;

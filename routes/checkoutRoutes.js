const express = require("express");
const { getCheckout, processPayment } = require("../controllers/checkoutController");
const router = express.Router();

// GET /checkout - Display checkout page
router.get("/", getCheckout);

// POST /checkout/process - Process payment
router.post("/process", processPayment);

module.exports = router;

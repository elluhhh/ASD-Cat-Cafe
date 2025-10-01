const express = require("express");
const { getCheckout, processPayment } = require("../controllers/checkoutController");

const router = express.Router();

router.get("/", getCheckout);
router.post("/process", processPayment);

module.exports = router;